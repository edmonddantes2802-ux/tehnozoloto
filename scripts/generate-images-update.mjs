// Генерирует миграцию 0006_unsplash_images.sql с UPDATE-ами поля images
// по совпадению title — берёт Unsplash-URL как раньше было в mock-данных.
// Тестовые товары (category='test') и ювелирку (category='gold') не трогает —
// у них остаётся аккуратный placehold.co.
//
// Запуск: node scripts/generate-images-update.mjs > supabase/migrations/0006_unsplash_images.sql

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '..', 'lib', 'products-data.ts'), 'utf8');

const IMG = {
  iphoneNew:    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  iphonePro:    'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
  iphoneMax:    'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80',
  iphoneOld:    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80',
  iphoneHand:   'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
  samsungS:     'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
  samsungUltra: 'https://images.unsplash.com/photo-1678911820864-e5cfd7c6c8df?w=800&q=80',
  samsungA:     'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80',
  pixel:        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
  xiaomi:       'https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80',
  oneplus:      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
  sonyXperia:   'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
  honor:        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
  foldable:     'https://images.unsplash.com/photo-1695048133115-f5d6c721f8f1?w=800&q=80',
  rogPhone:     'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
  android:      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  macbook:      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  makita:       'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
  philipsOld:   'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
};

function pickImage(title) {
  const t = title.toLowerCase();
  if (t.includes('philips')) return IMG.philipsOld;
  if (t.includes('makita')) return IMG.makita;
  if (t.includes('macbook')) return IMG.macbook;
  if (t.includes('iphone')) {
    if (t.includes('17') || t.includes('16') || t.includes('15')) {
      if (t.includes('pro max')) return IMG.iphoneMax;
      if (t.includes('pro')) return IMG.iphonePro;
      return IMG.iphoneNew;
    }
    if (t.includes('14')) {
      if (t.includes('pro max')) return IMG.iphoneMax;
      if (t.includes('pro') || t.includes('plus')) return IMG.iphonePro;
      return IMG.iphoneHand;
    }
    if (t.includes('13') || t.includes('12') || t.includes('11')) return IMG.iphoneOld;
    return IMG.iphoneNew;
  }
  if (t.includes('pixel')) return IMG.pixel;
  if (t.includes('samsung') || t.includes('galaxy')) {
    if (t.includes('ultra')) return IMG.samsungUltra;
    if (t.includes('a5') || t.includes('a3') || t.includes('a56')) return IMG.samsungA;
    return IMG.samsungS;
  }
  if (t.includes('xiaomi') || t.includes('redmi') || t.includes('poco')) return IMG.xiaomi;
  if (t.includes('oneplus') || t.includes('nord')) return IMG.oneplus;
  if (t.includes('honor') && (t.includes('magic v') || t.includes('fold'))) return IMG.foldable;
  if (t.includes('honor') || t.includes('huawei')) return IMG.honor;
  if (t.includes('sony') || t.includes('xperia')) return IMG.sonyXperia;
  if (t.includes('rog')) return IMG.rogPhone;
  return IMG.android;
}

const draftsBlock = src.match(/const DRAFTS:\s*Draft\[\]\s*=\s*\[([\s\S]*?)\];/);
if (!draftsBlock) {
  console.error('DRAFTS not found');
  process.exit(1);
}

const lineRe = /\{\s*title:\s*'([^']+)',\s*price:\s*\d+,\s*category:\s*'([^']+)'/g;
const updates = [];
const seenTitles = new Set();
let m;
while ((m = lineRe.exec(draftsBlock[1])) !== null) {
  const title = m[1];
  const category = m[2];
  // Дубли названий есть (несколько iPhone 14 128GB) — UPDATE применим ко всем строкам с таким title, без проблем.
  if (seenTitles.has(title)) continue;
  seenTitles.add(title);
  const url = pickImage(title);
  const escaped = title.replace(/'/g, "''");
  updates.push(`update products set images = ARRAY['${url}']::text[] where title = '${escaped}' and category != 'test';`);
}

console.log(`-- 0006_unsplash_images.sql
-- Возвращает Unsplash-фото вместо placehold.co для смартфонов / ноутбуков /
-- инструмента. Ювелирка ('gold') и тестовые товары не трогаются.
-- UPDATE по title — UUID товаров не меняются.

${updates.join('\n')}
`);
