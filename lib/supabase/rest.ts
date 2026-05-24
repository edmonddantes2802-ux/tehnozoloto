// Прямой REST-клиент Supabase через fetch, минующий @supabase/supabase-js SDK.
// Используется ТОЛЬКО на сервере с SUPABASE_SERVICE_ROLE_KEY (обходит RLS).
//
// Зачем: SDK supabase-js 2.x с новыми ключами формата sb_secret_* / sb_publishable_*
// в нашей связке (@supabase/ssr 0.10) ведёт себя нестабильно — INSERT/UPDATE
// тихо проваливаются. Прямой REST работает с любым форматом ключа.

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isAdminConfigured(): boolean {
  return !!BASE && !!KEY;
}

function authHeaders(): Record<string, string> {
  return {
    apikey: KEY!,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * GET /rest/v1/{table}?query
 * Возвращает массив строк или [] при ошибке/без конфигурации.
 */
export async function adminSelect<T = Record<string, unknown>>(
  table: string,
  query = ''
): Promise<T[]> {
  if (!isAdminConfigured()) return [];
  try {
    const url = `${BASE}/rest/v1/${table}${query ? '?' + query : ''}`;
    const res = await fetch(url, {
      headers: authHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(
        `[supabase.${table}.select] HTTP ${res.status}`,
        await res.text()
      );
      return [];
    }
    return (await res.json()) as T[];
  } catch (e) {
    console.error(`[supabase.${table}.select] fetch failed`, e);
    return [];
  }
}

/**
 * POST /rest/v1/{table}
 * Если returning=true — возвращает вставленную строку (header Prefer:
 * return=representation). Иначе минимальный ответ и null.
 */
export async function adminInsert<T = Record<string, unknown>>(
  table: string,
  data: Record<string, unknown>,
  returning = false
): Promise<{ ok: boolean; row: T | null; error?: string }> {
  if (!isAdminConfigured()) {
    return { ok: false, row: null, error: 'admin not configured' };
  }
  try {
    const res = await fetch(`${BASE}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        Prefer: returning ? 'return=representation' : 'return=minimal',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[supabase.${table}.insert] HTTP ${res.status}`, errText);
      return { ok: false, row: null, error: errText };
    }
    if (returning) {
      const arr = (await res.json()) as T[];
      return { ok: true, row: arr[0] ?? null };
    }
    return { ok: true, row: null };
  } catch (e) {
    console.error(`[supabase.${table}.insert] fetch failed`, e);
    return {
      ok: false,
      row: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * PATCH /rest/v1/{table}?query
 * query — это postgrest-фильтр, например "id=eq.42" или "id=in.(uuid1,uuid2)".
 */
export async function adminUpdate(
  table: string,
  query: string,
  data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  if (!isAdminConfigured()) {
    return { ok: false, error: 'admin not configured' };
  }
  try {
    const res = await fetch(`${BASE}/rest/v1/${table}?${query}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[supabase.${table}.update] HTTP ${res.status}`, errText);
      return { ok: false, error: errText };
    }
    return { ok: true };
  } catch (e) {
    console.error(`[supabase.${table}.update] fetch failed`, e);
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
