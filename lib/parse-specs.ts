// Парсер текстовых характеристик в пары «параметр → значение».
// Поддерживает форматы:
//   1) «Параметр: значение» (одной строкой)
//   2) «Параметр\tзначение» (Excel / таб)
//   3) «Параметр — значение» / «Параметр – значение» / «Параметр - значение»
//   4) «Параметр:» на одной строке, значение на следующей (M.Video, DNS, Я.Маркет)
//   5) Inline-формат: «Ключ1:знач1 Ключ2:знач2 Ключ3:знач3» (всё в одной строке без переносов).
//   6) Пустые строки и заголовки секций игнорируются.

export interface SpecPair {
  key: string;
  value: string;
}

const SEPARATORS_RE = /^([^—–\-:\t]+?)\s*[—–\-:\t]\s*(.+)$/u;
const NAME_WITH_COLON_RE = /^(.+?):\s*$/u;

// Слова, которые часто встречаются в значениях (бренды, термины, единицы
// измерения) и поэтому не должны восприниматься как начало нового ключа.
const NON_KEY_STARTERS = [
  // Единицы измерения
  'Гц', 'кГц', 'МГц', 'ГГц',
  'Вт', 'Втч', 'кВт', 'мВт',
  'Дж', 'Н·м',
  'кг', 'г',
  'мм', 'см', 'м',
  'МП', 'Мп',
  'Гб', 'ГБ', 'ТБ', 'МБ', 'КБ', 'Мб',
  'бар', 'нит', 'нм', 'л', 'мл',
  // Бренды
  'Apple', 'Asus', 'ASUS', 'Acer', 'Dell', 'HP', 'Lenovo', 'MSI',
  'Samsung', 'Sony', 'LG', 'Bosch', 'Makita', 'DeWalt', 'Xiaomi', 'Redmi', 'POCO',
  'Honor', 'Huawei', 'Google', 'OnePlus', 'OPPO', 'vivo', 'Realme', 'Tecno',
  // Модельные ряды
  'Vivobook', 'VivoBook', 'ZenBook', 'Zenbook', 'ROG', 'TUF', 'ExpertBook',
  'ThinkPad', 'IdeaPad', 'Yoga', 'Legion', 'LOQ',
  'MacBook', 'iMac', 'iPad', 'iPhone', 'AirPods',
  'Pavilion', 'Envy', 'Spectre', 'Omen', 'Victus', 'EliteBook', 'ProBook',
  'Inspiron', 'Latitude', 'Alienware', 'Aspire', 'Swift', 'Predator', 'Nitro',
  'Modern', 'Prestige', 'Stealth', 'Cyborg', 'Raider', 'Sword', 'Katana', 'Vector', 'Titan',
  // Чипы / GPU / сети
  'Intel', 'AMD', 'NVIDIA',
  'Iris', 'Radeon', 'GeForce', 'RTX', 'GTX', 'Vega', 'Arc',
  'Snapdragon', 'Tensor', 'Exynos', 'Bionic', 'Dimensity', 'Helio', 'Kirin', 'Unisoc',
  'Bluetooth', 'Wi-Fi', 'WiFi', 'USB', 'HDMI', 'DVI', 'VGA', 'Ethernet', 'LAN',
  'UHD', 'QHD', 'FHD', 'HD', 'OLED', 'AMOLED', 'IPS', 'LCD', 'TFT', 'mini-LED',
  'SSD', 'HDD', 'NVMe', 'M.2', 'eMMC', 'UFS', 'DDR4', 'DDR5', 'LPDDR4', 'LPDDR5',
  // Системы / ПО
  'Windows', 'Android', 'iOS', 'MacOS', 'macOS', 'Linux', 'Ubuntu', 'ChromeOS',
  // Связующие/модификаторы (одно слово после пробела часто часть значения)
  'Go', 'Pro', 'Plus', 'Max', 'Mini', 'Ultra', 'Lite', 'Slim', 'Edge', 'Air',
  'FE', 'SE', 'XL', 'Neo', 'Studio',
  // Аксессуары / компоненты
  'Graphics', 'Touchpad', 'Touch', 'Combo', 'Type',
  'Li-ion', 'Li-Po', 'NiMH', 'NiCd',
  // Прочее
  'DOS', 'OS', 'ОС', 'NO', 'ID', 'AI', 'TWS', 'IP67', 'IP68',
];
const NON_KEY_ALT = NON_KEY_STARTERS.map((u) =>
  u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|');

// Inline-парсер: для строк вида «Ключ1:знач1 Ключ2:знач2 ...».
// Ключ = 1–3 слова из букв (рус/лат, дефис, скобки, /), без цифр в самом ключе.
// Negative lookahead отсекает старт с единицы измерения / бренда / термина —
// чтобы не съело "Гц Тип матрицы" или "Vivobook Go Размер экрана" как один ключ.
const INLINE_KEY_RE = new RegExp(
  '(?:^|\\s)' +
    '(?!(?:' + NON_KEY_ALT + ')(?:[\\s:,.\\-]|$))' +
    '([А-ЯЁA-Z][А-Яа-яЁёA-Za-z()\\-/]+(?:\\s+[А-Яа-яЁёA-Za-z()\\-/]+){0,2}):',
  'gu'
);

function parseInline(text: string): SpecPair[] {
  const out: SpecPair[] = [];
  const matches = Array.from(text.matchAll(INLINE_KEY_RE));
  if (matches.length === 0) return out;

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const fullMatch = m[0]; // '\sКлюч:' или 'Ключ:'
    const key = m[1].trim();
    const colonIdx = (m.index ?? 0) + fullMatch.length - 1;
    const valStart = colonIdx + 1;
    const valEnd =
      i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    const value = text.slice(valStart, valEnd).trim();
    if (key.length > 0 && value.length > 0) {
      out.push({ key: capitalize(key), value });
    }
  }
  return out;
}

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

    // Кейс 0: строка содержит много двоеточий — формат «Ключ1:знач1 Ключ2:знач2...»,
    // часто встречается при копировании из DNS/Озон/Авито в одну строку.
    const colonCount = (line.match(/:/g) ?? []).length;
    if (colonCount >= 3) {
      const inline = parseInline(line);
      if (inline.length >= 2) {
        out.push(...inline);
        continue;
      }
    }

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
