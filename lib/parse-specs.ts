// Парсер текстовых характеристик в пары «параметр → значение».
// Поддерживает форматы:
//   1) «Параметр: значение» (одной строкой)
//   2) «Параметр\tзначение» (Excel / таб)
//   3) «Параметр — значение» / «Параметр – значение» / «Параметр - значение»
//   4) «Параметр:» на одной строке, значение на следующей (M.Video, DNS, Я.Маркет)
//   5) Пустые строки и заголовки секций игнорируются.

export interface SpecPair {
  key: string;
  value: string;
}

const SEPARATORS_RE = /^([^—–\-:\t]+?)\s*[—–\-:\t]\s*(.+)$/u;
const NAME_WITH_COLON_RE = /^(.+?):\s*$/u;

function isHeader(s: string): boolean {
  // Часто на сайтах есть заголовки секций без значений и без двоеточия в конце.
  // Если строка короткая (≤25 символов), не содержит цифр и без двоеточия —
  // считаем заголовком. Это эвристика; пользователь увидит превью и поправит.
  if (s.length > 40) return false;
  if (/\d/.test(s)) return false;
  if (s.endsWith(':')) return false;
  return true;
}

export function parseSpecs(raw: string): SpecPair[] {
  if (!raw) return [];
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const out: SpecPair[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Кейс 1: «Параметр: значение» / «Параметр — значение» / «Параметр\tзначение»
    const m = line.match(SEPARATORS_RE);
    if (m && m[2].trim().length > 0) {
      const key = m[1].trim();
      const value = m[2].trim();
      // Защита от ложного срабатывания, если ключ слишком длинный (предложение)
      if (key.length > 0 && key.length <= 80) {
        out.push({ key: capitalize(key), value });
        continue;
      }
    }

    // Кейс 2: «Параметр:» (двоеточие в конце), следующая строка — значение
    const colonMatch = line.match(NAME_WITH_COLON_RE);
    if (colonMatch && i + 1 < lines.length) {
      const next = lines[i + 1];
      // Следующая строка не должна быть тоже-ключом
      if (!next.endsWith(':') && !SEPARATORS_RE.test(next)) {
        out.push({ key: capitalize(colonMatch[1].trim()), value: next });
        i++; // потребили следующую строку
        continue;
      }
    }

    // Если строка похожа на заголовок секции — пропускаем
    if (isHeader(line)) {
      continue;
    }

    // Иначе — присоединяем к предыдущему значению (могло быть многострочное)
    if (out.length > 0) {
      const last = out[out.length - 1];
      last.value = (last.value + ' ' + line).trim();
    }
  }

  return out;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
