import type { ProductRow } from '@/types/database';

/**
 * Пул реальных фото техники с Unsplash (стабильные ID).
 * Если нужны фотки именно ВАШИХ товаров со склада — положите файл
 * `public/products/{id}.jpg` и он автоматически заменит фолбэк.
 */
const IMG = {
  // iPhone поколения
  iphoneNew:    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', // iPhone 15/16/17
  iphonePro:    'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80', // iPhone 14/15 Pro
  iphoneMax:    'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80', // iPhone Pro Max
  iphoneOld:    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80', // iPhone 11/12/13
  iphoneHand:   'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', // iPhone в руке
  // Samsung Galaxy
  samsungS:     'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', // Galaxy S-серия
  samsungUltra: 'https://images.unsplash.com/photo-1678911820864-e5cfd7c6c8df?w=800&q=80', // Galaxy Ultra
  samsungA:     'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80',   // Galaxy A-серия (бюджет)
  // Прочие бренды
  pixel:        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', // Google Pixel
  xiaomi:       'https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80', // Xiaomi/Redmi
  oneplus:      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80', // OnePlus / Nord
  sonyXperia:   'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80', // Sony / general
  honor:        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', // Honor / Huawei
  foldable:     'https://images.unsplash.com/photo-1695048133115-f5d6c721f8f1?w=800&q=80', // складные
  rogPhone:     'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80', // геймерский
  android:      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // generic Android
  // Не-смартфоны
  macbook:      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  makita:       'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
  philipsOld:   'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
};

function pickImage(id: string, title: string): string {
  // 1. Локальное фото приоритетнее
  const localOverride = `/products/${id}.jpg`;
  // Next.js сам отдаст 404 если файла нет — лучше резолвить через helper ниже.

  const t = title.toLowerCase();

  // Специальные случаи
  if (t.includes('philips')) return IMG.philipsOld;
  if (t.includes('makita')) return IMG.makita;
  if (t.includes('macbook')) return IMG.macbook;

  // iPhone — 4 варианта в зависимости от поколения
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
    if (t.includes('13') || t.includes('12') || t.includes('11')) {
      return IMG.iphoneOld;
    }
    return IMG.iphoneNew;
  }

  // Google Pixel
  if (t.includes('pixel')) return IMG.pixel;

  // Samsung Galaxy
  if (t.includes('samsung') || t.includes('galaxy')) {
    if (t.includes('ultra')) return IMG.samsungUltra;
    if (t.includes('a5') || t.includes('a3') || t.includes('a56')) return IMG.samsungA;
    return IMG.samsungS;
  }

  // Китайские флагманы / бюджет
  if (t.includes('xiaomi') || t.includes('redmi') || t.includes('poco')) return IMG.xiaomi;
  if (t.includes('oneplus') || t.includes('nord')) return IMG.oneplus;
  if (t.includes('honor') && (t.includes('magic v') || t.includes('fold'))) return IMG.foldable;
  if (t.includes('honor') || t.includes('huawei')) return IMG.honor;
  if (t.includes('sony') || t.includes('xperia')) return IMG.sonyXperia;
  if (t.includes('rog')) return IMG.rogPhone;

  return IMG.android;
}

interface Draft {
  title: string;
  description?: string;
  price: number;
  category: 'smartphone' | 'laptop' | 'tool';
  condition?: ProductRow['condition'];
}

const DRAFTS: Draft[] = [
  { title: 'Philips Xenium E111', price: 1290, category: 'smartphone', description: 'Кнопочный телефон', condition: 'good' },
  { title: 'Xiaomi Redmi 9C NFC', price: 4490, category: 'smartphone', description: '64 ГБ / 3 ГБ ОЗУ, чёрный. Глубокие царапины, 1–2 мелкие', condition: 'fair' },
  { title: 'Realme Note 60x 128GB', price: 4500, category: 'smartphone', description: 'Бюджетный смартфон с большой батареей', condition: 'excellent' },
  { title: 'Xiaomi Redmi 13C 4/128', price: 4590, category: 'smartphone', description: '6.74" HD+, MediaTek Helio G85', condition: 'excellent' },
  { title: 'Xiaomi Redmi 10A 6/128', price: 4900, category: 'smartphone', description: '6.53" HD+, Helio G25, 5000 мАч', condition: 'good' },
  { title: 'Xiaomi POCO C75 8/256', price: 5200, category: 'smartphone', description: '6.88" HD+, 50 МП, 5160 мАч', condition: 'excellent' },
  { title: 'Realme 9i 4/128', price: 5900, category: 'smartphone', description: 'Snapdragon 680, 90 Гц, 5000 мАч', condition: 'good' },
  { title: 'Tecno Spark 20 128GB', price: 5990, category: 'smartphone', description: '8 ГБ ОЗУ, чёрный, 6.6" 90 Гц', condition: 'excellent' },
  { title: 'Xiaomi Redmi 14C 256GB', price: 6200, category: 'smartphone', description: 'Синий, 6.88" 120 Гц, Helio G81', condition: 'excellent' },
  { title: 'POCO C65 8/256', price: 6200, category: 'smartphone', description: 'Helio G85, 50 МП, 5000 мАч', condition: 'excellent' },
  { title: 'Realme 9 Pro 128GB', price: 6500, category: 'smartphone', description: '8 ГБ ОЗУ, чёрный, Snapdragon 695 5G', condition: 'good' },
  { title: 'Sony Xperia 5 II 8/128', price: 6500, category: 'smartphone', description: 'Snapdragon 865, 120 Гц OLED, компактный флагман', condition: 'good' },
  { title: 'OPPO A5x 4/128', price: 6500, category: 'smartphone', description: 'CPH2725, 6.67" IPS 90 Гц, 6000 мАч', condition: 'excellent' },
  { title: 'Realme GT Master Edition 6/128', price: 7900, category: 'smartphone', description: 'Snapdragon 778G, 120 Гц AMOLED, 65 Вт зарядка', condition: 'good' },
  { title: 'Xiaomi Redmi Note 12S 256GB', price: 8900, category: 'smartphone', description: '8 ГБ ОЗУ, чёрный, 108 МП, AMOLED 120 Гц', condition: 'excellent' },
  { title: 'Makita GA7020 (УШМ)', price: 9500, category: 'tool', description: 'Углошлифовальная машина 180 мм, 2200 Вт', condition: 'good' },
  { title: 'OnePlus Nord 2 5G 256GB', price: 11900, category: 'smartphone', description: 'MediaTek Dimensity 1200-AI, 50 МП Sony IMX766', condition: 'good' },
  { title: 'Oppo Reno 12F 256GB', price: 12000, category: 'smartphone', description: 'Snapdragon 6 Gen 1, 120 Гц AMOLED, 5000 мАч', condition: 'excellent' },
  { title: 'iPhone 11 128GB', price: 12500, category: 'smartphone', description: 'АКБ 100%, комплект', condition: 'excellent' },
  { title: 'Sony Xperia 1 II', price: 13900, category: 'smartphone', description: '4K OLED 21:9, Snapdragon 865, 12 ГБ ОЗУ', condition: 'good' },
  { title: 'ASUS ROG Phone 3', price: 13990, category: 'smartphone', description: 'Геймерский: Snapdragon 865+, 144 Гц, 6000 мАч', condition: 'good' },
  { title: 'Honor 400 Lite 256GB', price: 14900, category: 'smartphone', description: '120 Гц AMOLED, 108 МП, 5230 мАч', condition: 'excellent' },
  { title: 'Samsung Galaxy S21 5G 8/256', price: 14900, category: 'smartphone', description: '120 Гц Dynamic AMOLED, Exynos 2100', condition: 'good' },
  { title: 'Samsung Galaxy A56 8/256', price: 18900, category: 'smartphone', description: '120 Гц Super AMOLED, Exynos 1580, 5000 мАч', condition: 'excellent' },
  { title: 'Samsung Galaxy S21+ 5G 8/256', price: 19900, category: 'smartphone', description: 'Чёрный, 6.7" 120 Гц AMOLED', condition: 'good' },
  { title: 'Xiaomi Redmi Note 13 Pro+ 512GB', price: 22000, category: 'smartphone', description: '200 МП, 120 Вт зарядка, AMOLED 120 Гц', condition: 'excellent' },
  { title: 'Xiaomi 14 12/512', price: 26900, category: 'smartphone', description: 'Snapdragon 8 Gen 3, Leica оптика, LTPO AMOLED', condition: 'excellent' },
  { title: 'iPhone 14 128GB', price: 26990, category: 'smartphone', description: 'Голубой, 6 ГБ ОЗУ', condition: 'excellent' },
  { title: 'iPhone 14 128GB', price: 26990, category: 'smartphone', description: 'Белый, 6 ГБ ОЗУ. Мелкие царапины', condition: 'good' },
  { title: 'Samsung Galaxy S22 Ultra 256GB', price: 29900, category: 'smartphone', description: 'Белый, S Pen, 108 МП, 120 Гц', condition: 'excellent' },
  { title: 'iPhone 14 Pro 128GB', price: 29900, category: 'smartphone', description: 'Dynamic Island, 48 МП, ProMotion 120 Гц', condition: 'excellent' },
  { title: 'Samsung Galaxy S25 FE 256GB', price: 33990, category: 'smartphone', description: 'Exynos 2400, 120 Гц AMOLED, Galaxy AI', condition: 'excellent' },
  { title: 'iPhone 13 Pro Max 256GB', price: 34900, category: 'smartphone', description: 'ProMotion 120 Гц, 6.7" Super Retina XDR', condition: 'excellent' },
  { title: 'Samsung Galaxy S24 8/256', price: 34900, category: 'smartphone', description: 'Snapdragon 8 Gen 3, Galaxy AI', condition: 'excellent' },
  { title: 'Google Pixel 9 128GB', price: 35000, category: 'smartphone', description: 'Розовый, Tensor G4, чистый Android', condition: 'excellent' },
  { title: 'iPhone 13 Pro Max 1TB', price: 35000, category: 'smartphone', description: 'Серый (Graphite), максимальный объём памяти', condition: 'excellent' },
  { title: 'iPhone 14 Plus 256GB', price: 35000, category: 'smartphone', description: '6.7" Liquid Retina, большая батарея', condition: 'excellent' },
  { title: 'HONOR Magic V2 16/512', price: 35900, category: 'smartphone', description: 'Складной флагман, 2 SIM, Snapdragon 8 Gen 2', condition: 'excellent' },
  { title: 'iPhone 15 128GB', price: 37900, category: 'smartphone', description: 'Голубой, Dynamic Island, USB-C', condition: 'excellent' },
  { title: 'Samsung Galaxy S24 8/256', price: 37900, category: 'smartphone', description: 'Galaxy AI, 120 Гц Dynamic AMOLED 2X', condition: 'excellent' },
  { title: 'iPhone 14 Pro Max 256GB', price: 39900, category: 'smartphone', description: 'Dynamic Island, 48 МП, ProMotion', condition: 'excellent' },
  { title: 'iPhone 15 128GB', price: 39990, category: 'smartphone', description: 'Голубой, 6 ГБ ОЗУ, без дефектов', condition: 'excellent' },
  { title: 'iPhone 16 128GB', price: 39990, category: 'smartphone', description: 'Чип A18, кнопка Camera Control', condition: 'excellent' },
  { title: 'iPhone 15 256GB', price: 42990, category: 'smartphone', description: 'АКБ 96%, как новый', condition: 'excellent' },
  { title: 'iPhone 15 128GB', price: 42990, category: 'smartphone', description: 'АКБ 89%, 542 цикла', condition: 'good' },
  { title: 'iPhone 14 Pro Max 256GB', price: 43990, category: 'smartphone', description: 'АКБ 74%', condition: 'good' },
  { title: 'MacBook Air 13" M1 256GB', price: 44900, category: 'laptop', description: 'M1 8C / 8GB / 256GB SSD / 13.3" Retina' },
  { title: 'iPhone 16E 256GB', price: 45900, category: 'smartphone', description: 'Бюджетный флагман с чипом A18', condition: 'excellent' },
  { title: 'iPhone 14 Pro Max 256GB', price: 49900, category: 'smartphone', description: 'Золотистый (Gold), Dynamic Island', condition: 'excellent' },
  { title: 'Samsung Galaxy S25 12/256', price: 54900, category: 'smartphone', description: 'Новый, Snapdragon 8 Elite, Galaxy AI', condition: 'new' },
  { title: 'iPhone 15 Pro Max 256GB', price: 55000, category: 'smartphone', description: 'Серый (Titanium), перископ 5x', condition: 'excellent' },
  { title: 'iPhone 15 Pro Max 256GB', price: 55500, category: 'smartphone', description: 'Серый (Titanium), A17 Pro, USB-C', condition: 'excellent' },
  { title: 'iPhone 17 Pro 256GB', price: 89990, category: 'smartphone', description: 'Оранжевый, новейший флагман Apple', condition: 'excellent' },
  { title: 'iPhone 17 Pro 256GB eSIM', price: 94500, category: 'smartphone', description: 'Только eSIM, топовая комплектация', condition: 'new' },
];

const TEST_PRODUCTS: ProductRow[] = Array.from({ length: 5 }, (_, i) => {
  const n = i + 1;
  return {
    id: `test${n}`,
    title: `тест${n}`,
    description: 'Тестовый товар для проверки оплаты — не реальная позиция.',
    price: 10,
    old_price: null,
    category: 'test',
    images: [],
    condition: 'good',
    is_sold: false,
    created_at: '',
  };
});

export const PRODUCTS: ProductRow[] = [
  ...DRAFTS.map((d, i) => {
    const id = String(i + 1);
    return {
      id,
      title: d.title,
      description: d.description ?? null,
      price: d.price,
      old_price: null,
      category: d.category,
      images: [pickImage(id, d.title)],
      condition: d.condition ?? 'excellent',
      is_sold: false,
      created_at: '',
    };
  }),
  ...TEST_PRODUCTS,
];

/** Подборка для витрины на главной — флагманы и хиты + 5 тестовых в самом конце. */
const FEATURED_FLAGSHIP_IDS = ['53', '51', '50', '47', '38', '49', '35', '30', '27'];

export const FEATURED_PRODUCT_IDS = [
  ...FEATURED_FLAGSHIP_IDS,
  ...TEST_PRODUCTS.map((p) => p.id),
];

export const FEATURED_PRODUCTS: ProductRow[] = FEATURED_PRODUCT_IDS
  .map((id) => PRODUCTS.find((p) => p.id === id))
  .filter((p): p is ProductRow => Boolean(p));
