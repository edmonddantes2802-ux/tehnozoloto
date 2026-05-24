import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Admin-клиент Supabase с service_role ключом — ОБХОДИТ RLS.
 * Использовать ТОЛЬКО на сервере (никогда в Client Components).
 *
 * Применение: webhooks от платёжных систем, фоновые задачи, админские action'ы.
 * Если SUPABASE_SERVICE_ROLE_KEY не задан — возвращает null, вызывающий код
 * должен корректно обработать это (например, лог + пропуск).
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as SupabaseClient<Database>;
}
