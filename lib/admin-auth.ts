// Подписанная stateless-сессия админки (HMAC-SHA256 через Web Crypto).
// Работает и в Node (route handlers), и в Edge (middleware).
//
// Кука хранит НЕ пароль, а токен `${exp}.${sig}`, где sig = HMAC(secret, exp).
// Это даёт срок жизни, не светит пароль в куке/логах и не валидируется без секрета.
//
// Секрет: ADMIN_SESSION_SECRET, иначе деривируется от ADMIN_PASSWORD.
// Если не задан ни один — вход в админку невозможен (никаких дефолтов).

const enc = new TextEncoder();
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 часов

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(new Uint8Array(sig));
}

/** Возвращает токен сессии или null, если секрет не сконфигурирован. */
export async function signSession(ttlMs = DEFAULT_TTL_MS): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const exp = String(Date.now() + ttlMs);
  const sig = await hmac(secret, exp);
  return `${exp}.${sig}`;
}

/** Проверяет токен: корректная подпись и не истёк срок. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Date.now()) return false;

  const expected = await hmac(secret, exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}
