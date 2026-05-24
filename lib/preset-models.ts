// Каталог пресетов моделей техники.
// При наборе title в админ-форме autocomplete подсказывает варианты;
// при выборе варианта поля description / category / specs автоматически
// заполняются дефолтными значениями. Менеджер может скорректировать.
//
// Battery_health сюда НЕ входит — он индивидуален для каждого экземпляра
// и заполняется руками.

import type { ProductSpecs } from '@/types/database';

export type ProductCategoryKey =
  | 'smartphone'
  | 'laptop'
  | 'tablet'
  | 'console'
  | 'audio'
  | 'tool'
  | 'gold'
  | 'other';

export const CATEGORY_LABELS: Record<ProductCategoryKey, string> = {
  smartphone: 'Смартфон',
  laptop: 'Ноутбук',
  tablet: 'Планшет',
  console: 'Игровая консоль',
  audio: 'Аудиотехника',
  tool: 'Инструмент',
  gold: 'Золото / ювелирка',
  other: 'Прочее',
};

export interface PresetModel {
  title: string;
  category: ProductCategoryKey;
  description: string;
  specs: ProductSpecs;
}

export const PRESET_MODELS: PresetModel[] = [
  // ===== iPhone =====
  {
    title: 'iPhone 11 128GB',
    category: 'smartphone',
    description: 'A13 Bionic, 6.1" Liquid Retina, двойная 12 МП',
    specs: { Чип: 'Apple A13 Bionic', RAM: '4 GB', Хранилище: '128 GB', Экран: '6.1" Liquid Retina HD', Камера: '12 + 12 МП', 'Защита IP': 'IP68', SIM: 'nano-SIM + eSIM' },
  },
  {
    title: 'iPhone 12 128GB',
    category: 'smartphone',
    description: 'A14 Bionic, 6.1" Super Retina XDR, MagSafe',
    specs: { Чип: 'Apple A14 Bionic', RAM: '4 GB', Хранилище: '128 GB', Экран: '6.1" Super Retina XDR OLED', Камера: '12 + 12 МП', 'Защита IP': 'IP68', '5G': 'есть' },
  },
  {
    title: 'iPhone 13 128GB',
    category: 'smartphone',
    description: 'A15 Bionic, 6.1" Super Retina XDR, кино-режим',
    specs: { Чип: 'Apple A15 Bionic', RAM: '4 GB', Хранилище: '128 GB', Экран: '6.1" Super Retina XDR', Камера: '12 + 12 МП (двойная)', 'Защита IP': 'IP68' },
  },
  {
    title: 'iPhone 13 Pro 256GB',
    category: 'smartphone',
    description: 'A15 Bionic, ProMotion 120 Гц, тройная 12 МП с LiDAR',
    specs: { Чип: 'Apple A15 Bionic', RAM: '6 GB', Хранилище: '256 GB', Экран: '6.1" Super Retina XDR ProMotion 120 Гц', Камера: 'Тройная 12 МП + LiDAR', 'Защита IP': 'IP68' },
  },
  {
    title: 'iPhone 13 Pro Max 256GB',
    category: 'smartphone',
    description: '6.7" ProMotion, A15 Bionic, тройная 12 МП с LiDAR',
    specs: { Чип: 'Apple A15 Bionic', RAM: '6 GB', Хранилище: '256 GB', Экран: '6.7" Super Retina XDR ProMotion', Камера: 'Тройная 12 МП + LiDAR', 'Защита IP': 'IP68' },
  },
  {
    title: 'iPhone 14 128GB',
    category: 'smartphone',
    description: 'A15 Bionic, 6.1" Super Retina XDR, улучшенная основная камера',
    specs: { Чип: 'Apple A15 Bionic', RAM: '6 GB', Хранилище: '128 GB', Экран: '6.1" Super Retina XDR', Камера: '12 + 12 МП', SOS: 'аварийный через спутник' },
  },
  {
    title: 'iPhone 14 Pro 256GB',
    category: 'smartphone',
    description: 'A16 Bionic, Dynamic Island, 48 МП основная, ProMotion',
    specs: { Чип: 'Apple A16 Bionic', RAM: '6 GB', Хранилище: '256 GB', Экран: '6.1" ProMotion 120 Гц LTPO', Камера: '48 + 12 + 12 МП + LiDAR', 'Dynamic Island': 'есть' },
  },
  {
    title: 'iPhone 14 Pro Max 256GB',
    category: 'smartphone',
    description: '6.7" ProMotion, A16 Bionic, 48 МП основная, Dynamic Island',
    specs: { Чип: 'Apple A16 Bionic', RAM: '6 GB', Хранилище: '256 GB', Экран: '6.7" ProMotion 120 Гц LTPO', Камера: '48 + 12 + 12 МП + LiDAR' },
  },
  {
    title: 'iPhone 15 128GB',
    category: 'smartphone',
    description: 'A16 Bionic, Dynamic Island, USB-C, 48 МП',
    specs: { Чип: 'Apple A16 Bionic', RAM: '6 GB', Хранилище: '128 GB', Экран: '6.1" Super Retina XDR', Порт: 'USB-C', Камера: '48 + 12 МП' },
  },
  {
    title: 'iPhone 15 Pro 256GB',
    category: 'smartphone',
    description: 'A17 Pro, титан, USB-C 3.0, 48 МП с теле',
    specs: { Чип: 'Apple A17 Pro', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.1" ProMotion 120 Гц LTPO', Камера: '48 + 12 + 12 МП + LiDAR', Корпус: 'титан', Порт: 'USB-C 3.0' },
  },
  {
    title: 'iPhone 15 Pro Max 256GB',
    category: 'smartphone',
    description: '6.7" ProMotion, A17 Pro, перископ 5×, титановый корпус',
    specs: { Чип: 'Apple A17 Pro', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.7" ProMotion 120 Гц LTPO', Камера: '48 + 12 + 12 МП, оптический зум 5×', Корпус: 'титан' },
  },
  {
    title: 'iPhone 16 128GB',
    category: 'smartphone',
    description: 'A18, кнопка Camera Control, Apple Intelligence',
    specs: { Чип: 'Apple A18', RAM: '8 GB', Хранилище: '128 GB', Экран: '6.1" Super Retina XDR', Камера: '48 + 12 МП', 'Camera Control': 'есть' },
  },
  {
    title: 'iPhone 16 Pro 256GB',
    category: 'smartphone',
    description: 'A18 Pro, 6.3" ProMotion, тройная 48 МП',
    specs: { Чип: 'Apple A18 Pro', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.3" ProMotion 120 Гц', Камера: '48 + 48 + 12 МП + LiDAR', Корпус: 'титан' },
  },

  // ===== Samsung Galaxy =====
  {
    title: 'Samsung Galaxy S21 5G 128GB',
    category: 'smartphone',
    description: 'Exynos 2100, 120 Гц Dynamic AMOLED',
    specs: { Чип: 'Exynos 2100', RAM: '8 GB', Хранилище: '128 GB', Экран: '6.2" Dynamic AMOLED 2X 120 Гц', Камера: '12 + 64 + 12 МП', '5G': 'есть' },
  },
  {
    title: 'Samsung Galaxy S22 Ultra 256GB',
    category: 'smartphone',
    description: 'S Pen, 108 МП, 120 Гц AMOLED',
    specs: { Чип: 'Exynos 2200 / SD 8 Gen 1', RAM: '12 GB', Хранилище: '256 GB', Экран: '6.8" Dynamic AMOLED 2X 120 Гц', Камера: '108 + 12 + 10 + 10 МП', 'S Pen': 'встроен' },
  },
  {
    title: 'Samsung Galaxy S23 256GB',
    category: 'smartphone',
    description: 'Snapdragon 8 Gen 2 for Galaxy',
    specs: { Чип: 'Snapdragon 8 Gen 2 for Galaxy', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.1" Dynamic AMOLED 2X 120 Гц', Камера: '50 + 12 + 10 МП' },
  },
  {
    title: 'Samsung Galaxy S24 Ultra 512GB',
    category: 'smartphone',
    description: 'Galaxy AI, S Pen, 200 МП',
    specs: { Чип: 'Snapdragon 8 Gen 3 for Galaxy', RAM: '12 GB', Хранилище: '512 GB', Экран: '6.8" Dynamic AMOLED 2X 120 Гц', Камера: '200 + 50 + 12 + 10 МП', 'S Pen': 'встроен' },
  },
  {
    title: 'Samsung Galaxy A55 5G 256GB',
    category: 'smartphone',
    description: 'Exynos 1480, 120 Гц AMOLED',
    specs: { Чип: 'Exynos 1480', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.6" Super AMOLED 120 Гц', Камера: '50 + 12 + 5 МП', '5G': 'есть' },
  },

  // ===== Xiaomi / Redmi / POCO =====
  {
    title: 'Xiaomi 13 256GB',
    category: 'smartphone',
    description: 'Snapdragon 8 Gen 2, Leica оптика',
    specs: { Чип: 'Snapdragon 8 Gen 2', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.36" AMOLED 120 Гц', Камера: '50 + 10 + 12 МП (Leica)', 'Защита IP': 'IP68' },
  },
  {
    title: 'Xiaomi 14 256GB',
    category: 'smartphone',
    description: 'Snapdragon 8 Gen 3, Leica, LTPO',
    specs: { Чип: 'Snapdragon 8 Gen 3', RAM: '12 GB', Хранилище: '256 GB', Экран: '6.36" LTPO AMOLED 120 Гц', Камера: '50 + 50 + 50 МП (Leica)' },
  },
  {
    title: 'Xiaomi Redmi Note 13 Pro 256GB',
    category: 'smartphone',
    description: '200 МП, AMOLED 120 Гц',
    specs: { Чип: 'Snapdragon 7s Gen 2', RAM: '8 GB', Хранилище: '256 GB', Экран: '6.67" AMOLED 120 Гц', Камера: '200 + 8 + 2 МП' },
  },
  {
    title: 'Xiaomi POCO X6 Pro 256GB',
    category: 'smartphone',
    description: 'Dimensity 8300-Ultra, AMOLED 120 Гц',
    specs: { Чип: 'MediaTek Dimensity 8300-Ultra', RAM: '12 GB', Хранилище: '256 GB', Экран: '6.67" AMOLED 120 Гц', Камера: '64 + 8 + 2 МП' },
  },

  // ===== Google Pixel =====
  {
    title: 'Google Pixel 8 128GB',
    category: 'smartphone',
    description: 'Tensor G3, чистый Android',
    specs: { Чип: 'Google Tensor G3', RAM: '8 GB', Хранилище: '128 GB', Экран: '6.2" OLED 120 Гц', Камера: '50 + 12 МП', ОС: 'Android (стоковый)' },
  },
  {
    title: 'Google Pixel 9 Pro 256GB',
    category: 'smartphone',
    description: 'Tensor G4, перископ, Gemini AI',
    specs: { Чип: 'Google Tensor G4', RAM: '16 GB', Хранилище: '256 GB', Экран: '6.3" LTPO OLED 120 Гц', Камера: '50 + 48 + 48 МП' },
  },

  // ===== OnePlus / Honor / Sony =====
  {
    title: 'OnePlus Nord 3 5G 256GB',
    category: 'smartphone',
    description: 'Dimensity 9000, 120 Гц AMOLED',
    specs: { Чип: 'MediaTek Dimensity 9000', RAM: '16 GB', Хранилище: '256 GB', Экран: '6.74" AMOLED 120 Гц', Камера: '50 + 8 + 2 МП' },
  },
  {
    title: 'Honor Magic V2 16/512',
    category: 'smartphone',
    description: 'Складной флагман, Snapdragon 8 Gen 2',
    specs: { Чип: 'Snapdragon 8 Gen 2', RAM: '16 GB', Хранилище: '512 GB', Тип: 'складной', 'Главный экран': '7.92" LTPO OLED 120 Гц', 'Внешний экран': '6.43" OLED 120 Гц' },
  },
  {
    title: 'Sony Xperia 1 V',
    category: 'smartphone',
    description: '4K OLED 21:9, Snapdragon 8 Gen 2',
    specs: { Чип: 'Snapdragon 8 Gen 2', RAM: '12 GB', Хранилище: '256 GB', Экран: '6.5" 4K OLED 120 Гц 21:9', Камера: '48 + 12 + 12 МП' },
  },

  // ===== MacBook =====
  {
    title: 'MacBook Air 13" M1 256GB',
    category: 'laptop',
    description: 'Apple M1, 8 ГБ RAM, без вентилятора',
    specs: { Процессор: 'Apple M1 (8 ядер)', RAM: '8 GB', Хранилище: '256 GB SSD', Экран: '13.3" Retina (2560×1600)', 'Авт. работа': 'до 18 ч', Вес: '1.29 кг' },
  },
  {
    title: 'MacBook Air 13" M2 256GB',
    category: 'laptop',
    description: 'Apple M2, MagSafe, 4 порта',
    specs: { Процессор: 'Apple M2 (8 ядер)', RAM: '8 GB', Хранилище: '256 GB SSD', Экран: '13.6" Liquid Retina (2560×1664)', 'Авт. работа': 'до 18 ч', Вес: '1.24 кг' },
  },
  {
    title: 'MacBook Pro 14" M3 Pro 512GB',
    category: 'laptop',
    description: 'M3 Pro, mini-LED ProMotion',
    specs: { Процессор: 'Apple M3 Pro (11 ядер)', RAM: '18 GB', Хранилище: '512 GB SSD', Экран: '14.2" Liquid Retina XDR ProMotion (3024×1964)', 'Авт. работа': 'до 18 ч' },
  },

  // ===== Планшеты =====
  {
    title: 'iPad 10 64GB Wi-Fi',
    category: 'tablet',
    description: 'A14 Bionic, 10.9" Liquid Retina',
    specs: { Чип: 'Apple A14 Bionic', Хранилище: '64 GB', Экран: '10.9" Liquid Retina', Связь: 'Wi-Fi' },
  },
  {
    title: 'iPad Air 11" M2 128GB',
    category: 'tablet',
    description: 'Apple M2, Liquid Retina, поддержка Apple Pencil Pro',
    specs: { Чип: 'Apple M2', Хранилище: '128 GB', Экран: '11" Liquid Retina', 'Apple Pencil': 'Pro поддерживается' },
  },
  {
    title: 'iPad Pro 11" M4 256GB',
    category: 'tablet',
    description: 'Apple M4, Ultra Retina XDR OLED',
    specs: { Чип: 'Apple M4', Хранилище: '256 GB', Экран: '11" Ultra Retina XDR OLED ProMotion 120 Гц', 'Apple Pencil': 'Pro' },
  },

  // ===== Игровые консоли =====
  {
    title: 'PlayStation 5 Slim Disc 1TB',
    category: 'console',
    description: 'Slim, с дисководом, 1 ТБ',
    specs: { Поколение: 'Sony PS5 Slim', Хранилище: '1 TB SSD', Дисковод: 'Blu-ray UHD', Геймпад: 'DualSense (1 в комплекте)' },
  },
  {
    title: 'PlayStation 5 Pro 2TB',
    category: 'console',
    description: 'PS5 Pro, ray-tracing, 2 ТБ',
    specs: { Поколение: 'Sony PS5 Pro', Хранилище: '2 TB SSD', Дисковод: 'без дисковода', Геймпад: 'DualSense (1 в комплекте)' },
  },
  {
    title: 'Xbox Series X 1TB',
    category: 'console',
    description: '4K 120 Гц, 1 ТБ SSD',
    specs: { Поколение: 'Microsoft Xbox Series X', Хранилище: '1 TB NVMe SSD', Видео: '4K @120 Гц', Геймпад: 'Xbox Wireless Controller' },
  },
  {
    title: 'Nintendo Switch OLED',
    category: 'console',
    description: '7" OLED, гибридная консоль',
    specs: { Поколение: 'Nintendo Switch (OLED)', Экран: '7" OLED 720p', Док: 'есть' },
  },

  // ===== Аудио =====
  {
    title: 'AirPods Pro 2 (USB-C)',
    category: 'audio',
    description: 'ANC, MagSafe, USB-C кейс',
    specs: { Тип: 'TWS вкладыши с силиконовыми насадками', ANC: 'есть', Чип: 'Apple H2', Кейс: 'MagSafe USB-C' },
  },
  {
    title: 'Sony WH-1000XM5',
    category: 'audio',
    description: 'Накладные с активным шумоподавлением',
    specs: { Тип: 'накладные беспроводные', ANC: 'есть', 'Авт. работа': 'до 30 ч', Кодеки: 'LDAC, AAC, SBC' },
  },

  // ===== Инструмент =====
  {
    title: 'Makita HP488DWE (Дрель-шуруповёрт)',
    category: 'tool',
    description: '18 В, 1.5 А·ч, кейс + 2 АКБ',
    specs: { Тип: 'аккумуляторная дрель-шуруповёрт', Напряжение: '18 В', АКБ: '1.5 А·ч × 2', Кейс: 'есть' },
  },

  // ===== Золото / Ювелирка =====
  {
    title: 'Цепь золотая 585, 8г',
    category: 'gold',
    description: 'Плетение Бисмарк',
    specs: { Проба: '585', Вес: '8 г', Плетение: 'Бисмарк' },
  },
  {
    title: 'Цепь золотая 585, 12г',
    category: 'gold',
    description: 'Якорное плетение',
    specs: { Проба: '585', Вес: '12 г', Плетение: 'Якорное' },
  },
  {
    title: 'Кольцо обручальное 585, 4г',
    category: 'gold',
    description: 'Классическое',
    specs: { Проба: '585', Вес: '4 г', Тип: 'обручальное' },
  },
  {
    title: 'Слиток золотой 999, 5г',
    category: 'gold',
    description: 'Банковский слиток',
    specs: { Проба: '999', Вес: '5 г', Тип: 'банковский слиток' },
  },
];

/** Поиск по подстроке для autocomplete (case-insensitive). */
export function searchPresets(query: string, limit = 8): PresetModel[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRESET_MODELS.filter((p) => p.title.toLowerCase().includes(q)).slice(0, limit);
}
