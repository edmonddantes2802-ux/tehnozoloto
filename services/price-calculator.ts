import type { Karat, TechCondition } from '@/types';

export const GOLD_PROMO_DISCOUNT = 0.1; // OPEN10

export const CONDITION_COEFFICIENT: Record<TechCondition, number> = {
  excellent: 0.85,
  good: 0.7,
  defective: 0.4,
};

/** Вес в граммах * цена за грамм * (1 - скидка). */
export function calcGoldPrice(
  weight: number,
  pricePerGram: number,
  promoApplied = false
): number {
  if (!isFinite(weight) || !isFinite(pricePerGram) || weight <= 0) return 0;
  const base = weight * pricePerGram;
  const discounted = promoApplied ? base * (1 - GOLD_PROMO_DISCOUNT) : base;
  return Math.round(discounted);
}

/** Базовая рыночная цена модели * коэффициент состояния. */
export function calcTechPrice(basePrice: number, condition: TechCondition): number {
  if (!isFinite(basePrice) || basePrice <= 0) return 0;
  return Math.round(basePrice * CONDITION_COEFFICIENT[condition]);
}

export type TechCategoryKey = 'smartphone' | 'laptop' | 'tablet' | 'console' | 'other';

export interface TechModel {
  name: string;
  basePrice: number;
  /** Короткие характеристики (актуально для ноутбуков): CPU / RAM / SSD / экран. */
  specs?: string;
  /** Производитель для группировки в UI. */
  brand?: string;
}

/**
 * Справочник моделей техники с базовой рыночной ценой (новое в магазине).
 * В боевой версии — таблица в Supabase, обновляется менеджером.
 */
export const TECH_CATALOG: Record<TechCategoryKey, TechModel[]> = {
  smartphone: [
    // --- Apple ---
    { brand: 'Apple', name: 'iPhone 16 Pro Max', basePrice: 140000 },
    { brand: 'Apple', name: 'iPhone 16 Pro', basePrice: 120000 },
    { brand: 'Apple', name: 'iPhone 16 Plus', basePrice: 100000 },
    { brand: 'Apple', name: 'iPhone 16', basePrice: 90000 },
    { brand: 'Apple', name: 'iPhone 15 Pro Max', basePrice: 110000 },
    { brand: 'Apple', name: 'iPhone 15 Pro', basePrice: 95000 },
    { brand: 'Apple', name: 'iPhone 15 Plus', basePrice: 82000 },
    { brand: 'Apple', name: 'iPhone 15', basePrice: 75000 },
    { brand: 'Apple', name: 'iPhone 14 Pro Max', basePrice: 90000 },
    { brand: 'Apple', name: 'iPhone 14 Pro', basePrice: 78000 },
    { brand: 'Apple', name: 'iPhone 14 Plus', basePrice: 68000 },
    { brand: 'Apple', name: 'iPhone 14', basePrice: 60000 },
    { brand: 'Apple', name: 'iPhone 13 Pro Max', basePrice: 70000 },
    { brand: 'Apple', name: 'iPhone 13 Pro', basePrice: 58000 },
    { brand: 'Apple', name: 'iPhone 13 mini', basePrice: 40000 },
    { brand: 'Apple', name: 'iPhone 13', basePrice: 45000 },
    { brand: 'Apple', name: 'iPhone 12 Pro Max', basePrice: 48000 },
    { brand: 'Apple', name: 'iPhone 12 Pro', basePrice: 40000 },
    { brand: 'Apple', name: 'iPhone 12', basePrice: 32000 },
    { brand: 'Apple', name: 'iPhone 12 mini', basePrice: 25000 },
    { brand: 'Apple', name: 'iPhone 11 Pro Max', basePrice: 30000 },
    { brand: 'Apple', name: 'iPhone 11 Pro', basePrice: 26000 },
    { brand: 'Apple', name: 'iPhone 11', basePrice: 22000 },
    { brand: 'Apple', name: 'iPhone SE 3 (2022)', basePrice: 28000 },
    { brand: 'Apple', name: 'iPhone XR', basePrice: 15000 },
    // --- Samsung ---
    { brand: 'Samsung', name: 'Samsung Galaxy S24 Ultra', basePrice: 95000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S24+', basePrice: 78000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S24', basePrice: 65000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S23 Ultra', basePrice: 75000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S23+', basePrice: 60000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S23 FE', basePrice: 42000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S23', basePrice: 50000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S22 Ultra', basePrice: 55000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S22+', basePrice: 45000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S22', basePrice: 38000 },
    { brand: 'Samsung', name: 'Samsung Galaxy S21 FE', basePrice: 30000 },
    { brand: 'Samsung', name: 'Samsung Galaxy Z Fold 5', basePrice: 130000 },
    { brand: 'Samsung', name: 'Samsung Galaxy Z Flip 5', basePrice: 80000 },
    { brand: 'Samsung', name: 'Samsung Galaxy A55', basePrice: 32000 },
    { brand: 'Samsung', name: 'Samsung Galaxy A54', basePrice: 25000 },
    { brand: 'Samsung', name: 'Samsung Galaxy A34', basePrice: 20000 },
    // --- Xiaomi / Redmi / POCO ---
    { brand: 'Xiaomi', name: 'Xiaomi 14 Ultra', basePrice: 95000 },
    { brand: 'Xiaomi', name: 'Xiaomi 14 Pro', basePrice: 75000 },
    { brand: 'Xiaomi', name: 'Xiaomi 14', basePrice: 60000 },
    { brand: 'Xiaomi', name: 'Xiaomi 13 Pro', basePrice: 55000 },
    { brand: 'Xiaomi', name: 'Xiaomi 13', basePrice: 40000 },
    { brand: 'Xiaomi', name: 'Xiaomi 13T Pro', basePrice: 45000 },
    { brand: 'Xiaomi', name: 'Xiaomi Redmi Note 13 Pro+', basePrice: 28000 },
    { brand: 'Xiaomi', name: 'Xiaomi Redmi Note 13 Pro', basePrice: 22000 },
    { brand: 'Xiaomi', name: 'Xiaomi Redmi Note 13', basePrice: 17000 },
    { brand: 'Xiaomi', name: 'Xiaomi Redmi Note 12', basePrice: 14000 },
    { brand: 'Xiaomi', name: 'POCO F6 Pro', basePrice: 38000 },
    { brand: 'Xiaomi', name: 'POCO X6 Pro', basePrice: 25000 },
    // --- Google Pixel ---
    { brand: 'Google', name: 'Google Pixel 9 Pro XL', basePrice: 90000 },
    { brand: 'Google', name: 'Google Pixel 9 Pro', basePrice: 75000 },
    { brand: 'Google', name: 'Google Pixel 9', basePrice: 60000 },
    { brand: 'Google', name: 'Google Pixel 8 Pro', basePrice: 65000 },
    { brand: 'Google', name: 'Google Pixel 8', basePrice: 50000 },
    { brand: 'Google', name: 'Google Pixel 8a', basePrice: 38000 },
    { brand: 'Google', name: 'Google Pixel 7 Pro', basePrice: 42000 },
    { brand: 'Google', name: 'Google Pixel 7', basePrice: 35000 },
    { brand: 'Google', name: 'Google Pixel 6a', basePrice: 22000 },
    // --- Huawei / Honor ---
    { brand: 'Huawei', name: 'Huawei Mate 60 Pro', basePrice: 85000 },
    { brand: 'Huawei', name: 'Huawei P60 Pro', basePrice: 55000 },
    { brand: 'Huawei', name: 'Huawei Nova 12', basePrice: 35000 },
    { brand: 'Honor', name: 'Honor Magic 6 Pro', basePrice: 70000 },
    { brand: 'Honor', name: 'Honor Magic 5 Pro', basePrice: 50000 },
    { brand: 'Honor', name: 'Honor 90', basePrice: 28000 },
    { brand: 'Honor', name: 'Honor X9b', basePrice: 20000 },
    // --- OnePlus / OPPO / Vivo / Realme ---
    { brand: 'OnePlus', name: 'OnePlus 12', basePrice: 65000 },
    { brand: 'OnePlus', name: 'OnePlus 11', basePrice: 48000 },
    { brand: 'OnePlus', name: 'OnePlus Nord 3', basePrice: 28000 },
    { brand: 'OPPO', name: 'OPPO Find X7 Ultra', basePrice: 80000 },
    { brand: 'OPPO', name: 'OPPO Reno 11 Pro', basePrice: 40000 },
    { brand: 'Vivo', name: 'Vivo X100 Pro', basePrice: 75000 },
    { brand: 'Vivo', name: 'Vivo V30 Pro', basePrice: 38000 },
    { brand: 'Realme', name: 'Realme GT 5 Pro', basePrice: 45000 },
    { brand: 'Realme', name: 'Realme 12 Pro+', basePrice: 28000 },
    // --- Прочее ---
    { brand: 'Nothing', name: 'Nothing Phone 2', basePrice: 42000 },
    { brand: 'Nothing', name: 'Nothing Phone 2a', basePrice: 25000 },
    { brand: 'ASUS', name: 'ASUS ROG Phone 8 Pro', basePrice: 95000 },
    { brand: 'Sony', name: 'Sony Xperia 1 V', basePrice: 80000 },
    { brand: 'Sony', name: 'Sony Xperia 5 V', basePrice: 60000 },
    { brand: 'Motorola', name: 'Motorola Edge 50 Pro', basePrice: 38000 },
    { brand: 'Motorola', name: 'Motorola Razr 40 Ultra', basePrice: 65000 },
    { brand: 'Tecno', name: 'Tecno Camon 30 Premier', basePrice: 28000 },
  ],
  laptop: [
    // --- Apple MacBook ---
    { brand: 'Apple', name: 'MacBook Pro 16" M3 Max', basePrice: 320000, specs: 'M3 Max 16C / 48GB / 1TB / 16.2" Liquid Retina XDR' },
    { brand: 'Apple', name: 'MacBook Pro 16" M3 Pro', basePrice: 250000, specs: 'M3 Pro 12C / 18GB / 512GB / 16.2" Liquid Retina XDR' },
    { brand: 'Apple', name: 'MacBook Pro 14" M3 Max', basePrice: 280000, specs: 'M3 Max 14C / 36GB / 1TB / 14.2" Liquid Retina XDR' },
    { brand: 'Apple', name: 'MacBook Pro 14" M3 Pro', basePrice: 220000, specs: 'M3 Pro 11C / 18GB / 512GB / 14.2" Liquid Retina XDR' },
    { brand: 'Apple', name: 'MacBook Pro 14" M3', basePrice: 165000, specs: 'M3 8C / 8GB / 512GB / 14.2" Liquid Retina XDR' },
    { brand: 'Apple', name: 'MacBook Pro 14" M2 Pro', basePrice: 180000, specs: 'M2 Pro 10C / 16GB / 512GB / 14.2"' },
    { brand: 'Apple', name: 'MacBook Pro 13" M2', basePrice: 110000, specs: 'M2 8C / 8GB / 256GB / 13.3" Retina' },
    { brand: 'Apple', name: 'MacBook Air 15" M3', basePrice: 140000, specs: 'M3 8C / 8GB / 256GB / 15.3" Liquid Retina' },
    { brand: 'Apple', name: 'MacBook Air 13" M3', basePrice: 115000, specs: 'M3 8C / 8GB / 256GB / 13.6" Liquid Retina' },
    { brand: 'Apple', name: 'MacBook Air 15" M2', basePrice: 110000, specs: 'M2 8C / 8GB / 256GB / 15.3"' },
    { brand: 'Apple', name: 'MacBook Air 13" M2', basePrice: 85000, specs: 'M2 8C / 8GB / 256GB / 13.6"' },
    { brand: 'Apple', name: 'MacBook Air 13" M1', basePrice: 65000, specs: 'M1 8C / 8GB / 256GB / 13.3" Retina' },
    // --- ASUS ---
    { brand: 'ASUS', name: 'ASUS ROG Zephyrus G16 (2024)', basePrice: 220000, specs: 'Intel Core Ultra 9 / RTX 4080 / 32GB / 1TB / 16" 2.5K 240Hz' },
    { brand: 'ASUS', name: 'ASUS ROG Zephyrus G14 (2024)', basePrice: 170000, specs: 'Ryzen 9 8945HS / RTX 4070 / 16GB / 1TB / 14" 3K OLED' },
    { brand: 'ASUS', name: 'ASUS ROG Strix Scar 17', basePrice: 260000, specs: 'Core i9-14900HX / RTX 4090 / 32GB / 2TB / 17.3" 240Hz' },
    { brand: 'ASUS', name: 'ASUS TUF Gaming F15', basePrice: 90000, specs: 'Core i7-13700H / RTX 4060 / 16GB / 512GB / 15.6" 144Hz' },
    { brand: 'ASUS', name: 'ASUS ZenBook 14 OLED', basePrice: 95000, specs: 'Core Ultra 7 / 16GB / 1TB / 14" 2.8K OLED 120Hz' },
    { brand: 'ASUS', name: 'ASUS ZenBook Duo', basePrice: 180000, specs: 'Core Ultra 9 / 32GB / 1TB / 2×14" OLED' },
    { brand: 'ASUS', name: 'ASUS VivoBook 16X', basePrice: 65000, specs: 'Core i5-13500H / 16GB / 512GB / 16" FHD+' },
    { brand: 'ASUS', name: 'ASUS VivoBook 15', basePrice: 45000, specs: 'Core i3-1215U / 8GB / 512GB / 15.6" FHD' },
    // --- Lenovo ---
    { brand: 'Lenovo', name: 'Lenovo ThinkPad X1 Carbon Gen 12', basePrice: 180000, specs: 'Core Ultra 7 / 32GB / 1TB / 14" 2.8K OLED' },
    { brand: 'Lenovo', name: 'Lenovo ThinkPad X1 Yoga', basePrice: 150000, specs: 'Core i7-1365U / 16GB / 512GB / 14" 2.2K touch' },
    { brand: 'Lenovo', name: 'Lenovo ThinkPad T14', basePrice: 95000, specs: 'Core i5-1335U / 16GB / 512GB / 14" WUXGA' },
    { brand: 'Lenovo', name: 'Lenovo Yoga Pro 9i', basePrice: 160000, specs: 'Core i9-13905H / RTX 4060 / 32GB / 1TB / 16" 3.2K mini-LED' },
    { brand: 'Lenovo', name: 'Lenovo Yoga Slim 7', basePrice: 95000, specs: 'Core Ultra 7 / 16GB / 1TB / 14" 2.8K OLED' },
    { brand: 'Lenovo', name: 'Lenovo Legion Pro 7i', basePrice: 230000, specs: 'Core i9-14900HX / RTX 4090 / 32GB / 1TB / 16" 2.5K 240Hz' },
    { brand: 'Lenovo', name: 'Lenovo Legion 5 Pro', basePrice: 130000, specs: 'Ryzen 7 7745HX / RTX 4060 / 16GB / 1TB / 16" 2.5K 165Hz' },
    { brand: 'Lenovo', name: 'Lenovo LOQ 15', basePrice: 75000, specs: 'Core i5-13450HX / RTX 4050 / 16GB / 512GB / 15.6" 144Hz' },
    { brand: 'Lenovo', name: 'Lenovo IdeaPad 5 Pro', basePrice: 70000, specs: 'Ryzen 5 7535HS / 16GB / 512GB / 16" 2.5K' },
    { brand: 'Lenovo', name: 'Lenovo IdeaPad 3', basePrice: 35000, specs: 'Core i3-1215U / 8GB / 256GB / 15.6" FHD' },
    // --- HP ---
    { brand: 'HP', name: 'HP Spectre x360 14', basePrice: 145000, specs: 'Core Ultra 7 / 16GB / 1TB / 14" 2.8K OLED touch' },
    { brand: 'HP', name: 'HP EliteBook 840 G11', basePrice: 130000, specs: 'Core Ultra 7 / 16GB / 512GB / 14" WUXGA' },
    { brand: 'HP', name: 'HP Envy 16', basePrice: 105000, specs: 'Core i7-13700H / RTX 4060 / 16GB / 1TB / 16" 2.5K' },
    { brand: 'HP', name: 'HP Omen 16', basePrice: 135000, specs: 'Core i7-13700HX / RTX 4070 / 16GB / 1TB / 16.1" 2.5K 240Hz' },
    { brand: 'HP', name: 'HP Victus 15', basePrice: 70000, specs: 'Ryzen 5 7535HS / RTX 2050 / 16GB / 512GB / 15.6" FHD 144Hz' },
    { brand: 'HP', name: 'HP Pavilion 15', basePrice: 48000, specs: 'Core i5-1335U / 16GB / 512GB / 15.6" FHD' },
    // --- Dell ---
    { brand: 'Dell', name: 'Dell XPS 16 (2024)', basePrice: 220000, specs: 'Core Ultra 9 / RTX 4070 / 32GB / 1TB / 16.3" 4K+ OLED touch' },
    { brand: 'Dell', name: 'Dell XPS 15', basePrice: 160000, specs: 'Core i7-13700H / RTX 4060 / 16GB / 1TB / 15.6" 3.5K OLED' },
    { brand: 'Dell', name: 'Dell XPS 13 Plus', basePrice: 130000, specs: 'Core Ultra 7 / 16GB / 512GB / 13.4" 2.8K OLED' },
    { brand: 'Dell', name: 'Dell Latitude 7440', basePrice: 120000, specs: 'Core i7-1365U / 16GB / 512GB / 14" FHD+' },
    { brand: 'Dell', name: 'Dell Alienware m18 R2', basePrice: 310000, specs: 'Core i9-14900HX / RTX 4090 / 32GB / 2TB / 18" QHD+ 165Hz' },
    { brand: 'Dell', name: 'Dell G15', basePrice: 85000, specs: 'Ryzen 7 7840HS / RTX 4060 / 16GB / 512GB / 15.6" FHD 165Hz' },
    { brand: 'Dell', name: 'Dell Inspiron 15', basePrice: 45000, specs: 'Core i5-1335U / 8GB / 512GB / 15.6" FHD' },
    // --- Acer ---
    { brand: 'Acer', name: 'Acer Swift X 14', basePrice: 110000, specs: 'Core Ultra 7 / RTX 4050 / 16GB / 1TB / 14.5" 2.8K OLED' },
    { brand: 'Acer', name: 'Acer Swift Go 14', basePrice: 70000, specs: 'Core Ultra 5 / 16GB / 512GB / 14" 2.2K' },
    { brand: 'Acer', name: 'Acer Predator Helios 16', basePrice: 175000, specs: 'Core i9-14900HX / RTX 4080 / 32GB / 1TB / 16" 2.5K 240Hz' },
    { brand: 'Acer', name: 'Acer Nitro 5', basePrice: 75000, specs: 'Ryzen 7 7735HS / RTX 4060 / 16GB / 512GB / 15.6" FHD 144Hz' },
    { brand: 'Acer', name: 'Acer Aspire 5', basePrice: 48000, specs: 'Core i5-1235U / 16GB / 512GB / 15.6" FHD' },
    // --- MSI ---
    { brand: 'MSI', name: 'MSI Titan 18 HX', basePrice: 380000, specs: 'Core i9-14900HX / RTX 4090 / 64GB / 2TB / 18" 4K mini-LED 120Hz' },
    { brand: 'MSI', name: 'MSI Raider GE78', basePrice: 270000, specs: 'Core i9-14900HX / RTX 4080 / 32GB / 1TB / 17" 2.5K 240Hz' },
    { brand: 'MSI', name: 'MSI Stealth 16 Studio', basePrice: 180000, specs: 'Core i7-13700H / RTX 4070 / 32GB / 1TB / 16" 2K 240Hz' },
    { brand: 'MSI', name: 'MSI Cyborg 15', basePrice: 80000, specs: 'Core i7-13620H / RTX 4060 / 16GB / 512GB / 15.6" FHD 144Hz' },
    { brand: 'MSI', name: 'MSI Modern 15', basePrice: 55000, specs: 'Core i5-1335U / 16GB / 512GB / 15.6" FHD' },
    // --- Razer / Microsoft / Huawei / Framework ---
    { brand: 'Razer', name: 'Razer Blade 16', basePrice: 290000, specs: 'Core i9-14900HX / RTX 4090 / 32GB / 1TB / 16" 2.5K 240Hz' },
    { brand: 'Razer', name: 'Razer Blade 14', basePrice: 200000, specs: 'Ryzen 9 8945HS / RTX 4070 / 16GB / 1TB / 14" 2.8K 240Hz' },
    { brand: 'Microsoft', name: 'Surface Laptop Studio 2', basePrice: 210000, specs: 'Core i7-13700H / RTX 4060 / 32GB / 1TB / 14.4" 2.4K touch' },
    { brand: 'Microsoft', name: 'Surface Laptop 5 13.5"', basePrice: 110000, specs: 'Core i7-1255U / 16GB / 512GB / 13.5" 2.2K touch' },
    { brand: 'Microsoft', name: 'Surface Pro 9', basePrice: 115000, specs: 'Core i7-1255U / 16GB / 512GB / 13" 2.8K touch' },
    { brand: 'Huawei', name: 'Huawei MateBook X Pro (2024)', basePrice: 130000, specs: 'Core Ultra 9 / 32GB / 1TB / 14.2" 3.1K OLED touch' },
    { brand: 'Huawei', name: 'Huawei MateBook 14', basePrice: 70000, specs: 'Core i5-1340P / 16GB / 512GB / 14.2" 2.1K touch' },
    { brand: 'Framework', name: 'Framework Laptop 16', basePrice: 190000, specs: 'Ryzen 9 7940HS / RX 7700S / 32GB / 1TB / 16" 2.5K 165Hz' },
    { brand: 'Gigabyte', name: 'Gigabyte Aorus 17X', basePrice: 250000, specs: 'Core i9-14900HX / RTX 4090 / 32GB / 1TB / 17" 2.5K 240Hz' },
  ],
  tablet: [
    { name: 'iPad Pro 13" M4', basePrice: 130000 },
    { name: 'iPad Pro 11" M4', basePrice: 95000 },
    { name: 'iPad Pro 12.9" M2', basePrice: 95000 },
    { name: 'iPad Air M2 13"', basePrice: 80000 },
    { name: 'iPad Air M2 11"', basePrice: 60000 },
    { name: 'iPad Air 5', basePrice: 45000 },
    { name: 'iPad 10', basePrice: 35000 },
    { name: 'iPad mini 6', basePrice: 40000 },
    { name: 'Samsung Galaxy Tab S9 Ultra', basePrice: 85000 },
    { name: 'Samsung Galaxy Tab S9', basePrice: 55000 },
    { name: 'Samsung Galaxy Tab S8', basePrice: 40000 },
    { name: 'Xiaomi Pad 6', basePrice: 25000 },
    { name: 'Huawei MatePad 11', basePrice: 30000 },
  ],
  console: [
    { name: 'PlayStation 5 Pro', basePrice: 65000 },
    { name: 'PlayStation 5 Slim', basePrice: 45000 },
    { name: 'PlayStation 5', basePrice: 40000 },
    { name: 'PlayStation 5 Digital', basePrice: 35000 },
    { name: 'PlayStation 4 Pro', basePrice: 22000 },
    { name: 'PlayStation 4 Slim', basePrice: 15000 },
    { name: 'Xbox Series X', basePrice: 45000 },
    { name: 'Xbox Series S', basePrice: 28000 },
    { name: 'Xbox One X', basePrice: 18000 },
    { name: 'Nintendo Switch OLED', basePrice: 28000 },
    { name: 'Nintendo Switch', basePrice: 20000 },
    { name: 'Nintendo Switch Lite', basePrice: 15000 },
    { name: 'Steam Deck OLED', basePrice: 60000 },
    { name: 'Steam Deck', basePrice: 40000 },
  ],
  other: [
    { name: 'Apple Watch Ultra 2', basePrice: 75000 },
    { name: 'Apple Watch Series 9', basePrice: 35000 },
    { name: 'Apple Watch SE', basePrice: 20000 },
    { name: 'AirPods Pro 2', basePrice: 18000 },
    { name: 'AirPods Max', basePrice: 40000 },
    { name: 'Sony WH-1000XM5', basePrice: 25000 },
    { name: 'DJI Mavic 3', basePrice: 150000 },
    { name: 'DJI Mini 4 Pro', basePrice: 75000 },
    { name: 'GoPro Hero 12', basePrice: 35000 },
    { name: 'Canon EOS R6', basePrice: 180000 },
    { name: 'Sony A7 IV', basePrice: 200000 },
  ],
};

export const TECH_CATEGORY_LABELS: Record<TechCategoryKey, string> = {
  smartphone: 'Смартфон',
  laptop: 'Ноутбук',
  tablet: 'Планшет',
  console: 'Игровая консоль',
  other: 'Другое',
};

/** Плоский справочник для быстрого lookup по имени. */
export const TECH_BASE_PRICES: Record<string, number> = Object.fromEntries(
  Object.values(TECH_CATALOG).flatMap((models) =>
    models.map((m) => [m.name.toLowerCase(), m.basePrice])
  )
);

export function lookupBasePrice(model: string): number {
  const key = model.trim().toLowerCase();
  if (!key) return 0;
  if (TECH_BASE_PRICES[key]) return TECH_BASE_PRICES[key];
  // fuzzy: ищем первую модель, чьё имя содержит введённое или наоборот
  for (const [k, v] of Object.entries(TECH_BASE_PRICES)) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return 20000; // средняя оценка по умолчанию
}

export function findGoldPrice(
  prices: Array<{ karat: number; price_per_gram: number }>,
  karat: Karat
): number {
  return prices.find((p) => p.karat === karat)?.price_per_gram ?? 0;
}
