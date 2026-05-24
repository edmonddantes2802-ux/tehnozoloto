// Генератор Supabase seed-миграции для каталога.
// Парсит DRAFTS из lib/products-data.ts и выдаёт SQL, который:
//   1. Удаляет старые seed-товары (категории smartphone/laptop/tool/gold/other)
//   2. Вставляет полный список с placehold.co-картинками, цвет фона зависит
//      от категории.
//
// Запуск:
//   node scripts/generate-seed.mjs > supabase/migrations/0005_full_seed.sql

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '..', 'lib', 'products-data.ts'), 'utf8');

const draftsBlock = src.match(/const DRAFTS:\s*Draft\[\]\s*=\s*\[([\s\S]*?)\];/);
if (!draftsBlock) {
  console.error('DRAFTS array not found in products-data.ts');
  process.exit(1);
}

const drafts = [];
const lineRe = /\{\s*title:\s*'([^']+)',\s*price:\s*(\d+),\s*category:\s*'([^']+)',(?:\s*description:\s*'([^']*)',)?(?:\s*condition:\s*'([^']+)')?\s*\}/g;
let m;
while ((m = lineRe.exec(draftsBlock[1])) !== null) {
  drafts.push({
    title: m[1],
    price: Number(m[2]),
    category: m[3],
    description: m[4] ?? null,
    condition: m[5] ?? 'excellent',
  });
}

// Категорийная палитра placehold.co (bg / fg)
const palette = {
  smartphone: ['E5E7EB', '1A2B3C'],
  laptop:     ['374151', 'F8FAFC'],
  tool:       ['FEF3C7', 'C2410C'],
  gold:       ['F1D592', '1A2B3C'],
  other:      ['E0E7FF', '4338CA'],
  test:       ['FEE2E2', 'DC2626'],
};

function placeholderUrl(title, category) {
  const [bg, fg] = palette[category] ?? palette.other;
  const text = encodeURIComponent(title).replace(/%20/g, '+');
  return `https://placehold.co/800x600/${bg}/${fg}?text=${text}`;
}

function escapeSqlString(s) {
  if (s === null) return 'null';
  return `'${s.replace(/'/g, "''")}'`;
}

// Условие для conditions: только из набора enum
const VALID_CONDITIONS = new Set(['new', 'excellent', 'good', 'fair']);

const valuesLines = drafts.map((d) => {
  const condition = VALID_CONDITIONS.has(d.condition) ? d.condition : 'excellent';
  return `  (${escapeSqlString(d.title)}, ${escapeSqlString(d.description)}, ${d.price}, ${escapeSqlString(d.category)}, ${escapeSqlString(condition)}, ARRAY[${escapeSqlString(placeholderUrl(d.title, d.category))}]::text[])`;
});

// Заодно добавим несколько товаров категории gold, которых в mock не было
const goldExtras = [
  { title: 'Цепь золотая 585, 12г', description: 'Якорное плетение', price: 36800, category: 'gold', condition: 'excellent' },
  { title: 'Кольцо обручальное 585, 4г', description: 'Классическое', price: 12200, category: 'gold', condition: 'excellent' },
  { title: 'Серьги золотые 585, 2.5г', description: 'Английский замок', price: 8500, category: 'gold', condition: 'excellent' },
  { title: 'Браслет золотой 585, 6г', description: 'Плетение Нонна', price: 18900, category: 'gold', condition: 'excellent' },
  { title: 'Слиток золотой 999, 5г', description: 'Сбербанк, в упаковке', price: 31000, category: 'gold', condition: 'new' },
];

for (const g of goldExtras) {
  valuesLines.push(
    `  (${escapeSqlString(g.title)}, ${escapeSqlString(g.description)}, ${g.price}, ${escapeSqlString(g.category)}, ${escapeSqlString(g.condition)}, ARRAY[${escapeSqlString(placeholderUrl(g.title, g.category))}]::text[])`
  );
}

// Тестовые товары (с категорией test) оставляем нетронутыми — это другой сид.

console.log(`-- 0005_full_seed.sql
-- Полный сид каталога: ~60 товаров + плейсхолдер-картинки по категориям.
-- Заменяет minimal-сид из 0001_init.sql. Тестовые товары (category='test')
-- из 0004 НЕ трогает.

-- Удаляем старые seed-товары всех нерезких категорий, кроме test.
delete from products where category != 'test';

-- Полный ассортимент с placehold.co-картинками
insert into products (title, description, price, category, condition, images) values
${valuesLines.join(',\n')};
`);
