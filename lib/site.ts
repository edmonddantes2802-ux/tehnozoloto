// Базовый URL сайта. Используется в metadata, sitemap, robots, manifest, JSON-LD.
// Задаётся через NEXT_PUBLIC_SITE_URL; фолбэк — прод-домен.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tehnozoloto.imryazapov.ru';
