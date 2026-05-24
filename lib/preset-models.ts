// Каталог категорий и пресетов моделей техники.
// При наборе title в админ-форме autocomplete подсказывает варианты;
// при выборе варианта поля description / category / specs автоматически
// заполняются дефолтными значениями. Менеджер может скорректировать.
//
// Battery_health сюда НЕ входит — он индивидуален для каждого экземпляра
// и заполняется руками.

import type { ProductSpecs } from '@/types/database';
import { EXTENDED_MODELS } from './preset-models-extended';

// ============ КАТЕГОРИИ ============
// ~30 категорий, релевантных для комиссионного магазина.

export const CATEGORY_LABELS = {
  // Электроника / гаджеты
  smartphone: 'Смартфон',
  tablet: 'Планшет',
  laptop: 'Ноутбук',
  desktop_pc: 'Настольный ПК / моноблок',
  monitor: 'Монитор',
  console: 'Игровая консоль',
  console_game: 'Игра для консоли',
  audio_headphones: 'Наушники',
  audio_speaker: 'Колонка / акустика',
  tv: 'Телевизор',
  camera: 'Фото-/видеокамера',
  camera_lens: 'Объектив',
  ebook: 'Электронная книга',
  smartwatch: 'Умные часы / фитнес-браслет',
  drone: 'Дрон / квадрокоптер',
  network: 'Сетевое оборудование',
  gaming_periph: 'Игровая периферия',

  // Бытовая техника
  appliance_large: 'Крупная бытовая техника',
  appliance_kitchen: 'Кухонная техника',
  appliance_clean: 'Техника для уборки',
  appliance_care: 'Техника для ухода',

  // Инструмент
  tool_power: 'Электроинструмент',
  tool_hand: 'Ручной инструмент',
  tool_garden: 'Садовый инструмент',

  // Ювелирка / драгметаллы
  gold: 'Золото',
  silver: 'Серебро',
  gem: 'Драгоценные камни',
  watch_lux: 'Часы (механические/премиум)',

  // Транспорт без двигателя
  ebike: 'Велосипед / электровелосипед',
  escooter: 'Электросамокат',
  skateboard: 'Скейтборд / лонгборд',

  // Хобби и спорт
  music_instrument: 'Музыкальный инструмент',
  sports: 'Спортивный инвентарь',
  book: 'Книга / винил',
  collectibles: 'Коллекционные',

  // Прочее
  test: 'Тестовая позиция',
  other: 'Прочее',
} as const;

export type ProductCategoryKey = keyof typeof CATEGORY_LABELS;

export const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as ProductCategoryKey[];

// ============ ПРЕСЕТ-МОДЕЛИ ============

export interface PresetModel {
  title: string;
  /** Если не задан — берётся из getBrand(p) по эвристике из title. */
  brand?: string;
  category: ProductCategoryKey;
  description: string;
  specs: ProductSpecs;
}

/**
 * Эвристика «бренд из заголовка». Не идеально для всех случаев,
 * но покрывает 120+ наших моделей. Для специфики можно прокинуть
 * явный brand в PresetModel.
 */
export function extractBrand(title: string, category?: ProductCategoryKey): string {
  const t = title.toLowerCase();
  if (t.startsWith('iphone') || t.startsWith('ipad') || t.startsWith('macbook') ||
      t.startsWith('apple watch') || t.startsWith('airpods')) return 'Apple';
  if (t.startsWith('samsung')) return 'Samsung';
  if (t.startsWith('google ') || t.startsWith('pixel ')) return 'Google';
  if (t.startsWith('xiaomi') || t.startsWith('redmi') || t.startsWith('poco')) return 'Xiaomi';
  if (t.startsWith('honor')) return 'Honor';
  if (t.startsWith('huawei')) return 'Huawei';
  if (t.startsWith('oneplus')) return 'OnePlus';
  if (t.startsWith('oppo')) return 'OPPO';
  if (t.startsWith('vivo')) return 'vivo';
  if (t.startsWith('realme')) return 'Realme';
  if (t.startsWith('tecno')) return 'Tecno';
  if (t.startsWith('sony xperia') || t.startsWith('sony wh') || t.startsWith('sony wf') ||
      t.startsWith('sony alpha') || t.startsWith('sony bravia') ||
      t.startsWith('playstation') || t.startsWith('ps5') || t.startsWith('ps4')) return 'Sony';
  if (t.startsWith('xbox')) return 'Microsoft';
  if (t.startsWith('nintendo')) return 'Nintendo';
  if (t.startsWith('valve') || t.startsWith('steam deck')) return 'Valve';
  if (t.startsWith('asus')) return 'ASUS';
  if (t.startsWith('lenovo')) return 'Lenovo';
  if (t.startsWith('hp ')) return 'HP';
  if (t.startsWith('acer')) return 'Acer';
  if (t.startsWith('dell')) return 'Dell';
  if (t.startsWith('msi')) return 'MSI';
  if (t.startsWith('bose')) return 'Bose';
  if (t.startsWith('marshall')) return 'Marshall';
  if (t.startsWith('jbl')) return 'JBL';
  if (t.startsWith('sonos')) return 'Sonos';
  if (t.startsWith('яндекс')) return 'Яндекс';
  if (t.startsWith('vk ')) return 'VK';
  if (t.startsWith('canon')) return 'Canon';
  if (t.startsWith('nikon')) return 'Nikon';
  if (t.startsWith('fujifilm')) return 'Fujifilm';
  if (t.startsWith('sigma')) return 'Sigma';
  if (t.startsWith('dji')) return 'DJI';
  if (t.startsWith('ninebot')) return 'Ninebot';
  if (t.startsWith('kugoo')) return 'Kugoo';
  if (t.startsWith('stels')) return 'STELS';
  if (t.startsWith('trek')) return 'Trek';
  if (t.startsWith('giant')) return 'Giant';
  if (t.startsWith('roborock')) return 'Roborock';
  if (t.startsWith('dyson')) return 'Dyson';
  if (t.startsWith('delonghi')) return 'DeLonghi';
  if (t.startsWith('philips')) return 'Philips';
  if (t.startsWith('bosch')) return 'Bosch';
  if (t.startsWith('makita')) return 'Makita';
  if (t.startsWith('dewalt')) return 'DeWalt';
  if (t.startsWith('knipex')) return 'Knipex';
  if (t.startsWith('stanley')) return 'Stanley';
  if (t.startsWith('wera')) return 'Wera';
  if (t.startsWith('seiko')) return 'Seiko';
  if (t.startsWith('casio')) return 'Casio';
  if (t.startsWith('tissot')) return 'Tissot';
  if (t.startsWith('garmin')) return 'Garmin';
  if (t.startsWith('lg ')) return 'LG';
  // По-русски — золотые/серебряные изделия
  if (category === 'gold' || category === 'silver') return 'Прочее';
  // Игры
  if (category === 'console_game') {
    if (t.includes('(ps5)') || t.includes('(ps4)')) return 'Sony';
    if (t.includes('(switch)')) return 'Nintendo';
    if (t.includes('(xbox)')) return 'Microsoft';
  }
  return 'Прочее';
}

export function getBrand(p: PresetModel): string {
  return p.brand ?? extractBrand(p.title, p.category);
}

// ============ ТОП-БРЕНДЫ ПО КАТЕГОРИЯМ ============
// Первые 10 показываются кнопками-чипсами; остальные открываются спойлером.
// Список будет расширяться по мере добавления моделей.

export const TOP_BRANDS_BY_CATEGORY: Record<ProductCategoryKey, string[]> = {
  smartphone: ['Apple', 'Samsung', 'Xiaomi', 'Honor', 'Google', 'OnePlus', 'Sony', 'OPPO', 'vivo', 'Realme'],
  tablet: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Microsoft', 'Honor', 'OPPO', 'Realme', 'TCL'],
  laptop: ['Apple', 'ASUS', 'Lenovo', 'HP', 'Acer', 'Dell', 'MSI', 'Huawei', 'Honor', 'Samsung'],
  desktop_pc: ['Apple', 'ASUS', 'HP', 'Lenovo', 'Acer', 'MSI', 'Dell', 'DEXP', 'Pulser', 'iRU'],
  monitor: ['LG', 'Samsung', 'ASUS', 'Acer', 'Dell', 'MSI', 'BenQ', 'AOC', 'Philips', 'ViewSonic'],
  console: ['Sony', 'Microsoft', 'Nintendo', 'Valve', 'Steam', 'Sega', 'Logitech G', 'ASUS ROG', 'Razer', 'Atari'],
  console_game: ['Sony', 'Microsoft', 'Nintendo', 'Bandai Namco', 'Capcom', 'Square Enix', 'Ubisoft', 'Activision', 'Sega', 'CD Projekt'],
  audio_headphones: ['Apple', 'Sony', 'Bose', 'Marshall', 'JBL', 'Sennheiser', 'Beats', 'Anker', 'Xiaomi', 'Samsung'],
  audio_speaker: ['JBL', 'Marshall', 'Sonos', 'Bose', 'Sony', 'Яндекс', 'VK', 'Sber', 'Anker', 'Harman Kardon'],
  tv: ['LG', 'Samsung', 'Sony', 'Xiaomi', 'TCL', 'Philips', 'Hisense', 'Haier', 'DEXP', 'Sber'],
  camera: ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Olympus / OM System', 'GoPro', 'DJI', 'Insta360'],
  camera_lens: ['Canon', 'Sony', 'Nikon', 'Sigma', 'Tamron', 'Fujifilm', 'Panasonic', 'Samyang', 'Tokina', 'Zeiss'],
  ebook: ['PocketBook', 'ONYX BOOX', 'Amazon Kindle', 'reMarkable', 'Digma', 'Tesla', 'Kobo', 'Barnes & Noble', 'Texet', 'Wexler'],
  smartwatch: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Xiaomi', 'Honor', 'Amazfit', 'Fitbit', 'Polar', 'Withings'],
  drone: ['DJI', 'Autel', 'Parrot', 'XAG', 'Holy Stone', 'Hubsan', 'Walkera', 'Skydio', 'Yuneec', 'Insta360'],
  network: ['TP-Link', 'Keenetic', 'ASUS', 'Mikrotik', 'D-Link', 'Xiaomi', 'Mercusys', 'Netgear', 'Ubiquiti', 'Huawei'],
  gaming_periph: ['Logitech G', 'Razer', 'SteelSeries', 'HyperX', 'Corsair', 'ASUS ROG', 'Glorious', 'Pulsar', 'Roccat', 'Cooler Master'],
  appliance_large: ['LG', 'Samsung', 'Bosch', 'Indesit', 'Hotpoint-Ariston', 'Haier', 'Beko', 'Atlant', 'Candy', 'Hisense'],
  appliance_kitchen: ['DeLonghi', 'Philips', 'Bosch', 'Bork', 'Tefal', 'Polaris', 'Redmond', 'Kenwood', 'Braun', 'Kitfort'],
  appliance_clean: ['Roborock', 'Xiaomi', 'iRobot', 'Dyson', 'Karcher', 'Polaris', 'Samsung', 'LG', 'Tefal', 'Philips'],
  appliance_care: ['Philips', 'Braun', 'Rowenta', 'Tefal', 'Bosch', 'Remington', 'BaByliss', 'Panasonic', 'Dyson', 'Xiaomi'],
  tool_power: ['Makita', 'Bosch', 'DeWalt', 'Metabo', 'Hilti', 'Hammer', 'Интерскол', 'Зубр', 'Patriot', 'AEG'],
  tool_hand: ['Knipex', 'Stanley', 'Wera', 'Wiha', 'Force', 'Зубр', 'JONNESWAY', 'Gross', 'KraftTool', 'Matrix'],
  tool_garden: ['Husqvarna', 'STIHL', 'Makita', 'Bosch', 'Patriot', 'Champion', 'Greenworks', 'Зубр', 'AL-KO', 'Echo'],
  gold: ['585 Золотой', 'Sokolov', 'Sunlight', 'Эстет', 'Адамас', 'Линии Любви', 'Бронницкий ювелир', 'Lukas', 'Diamant', 'Прочее'],
  silver: ['Sokolov', 'Эстет', 'Sunlight', 'Pandora', 'Sokolov Diamonds', 'Адамас', 'Lukas', 'Tiffany & Co.', 'Diamant', 'Прочее'],
  gem: ['Tiffany & Co.', 'Cartier', 'Boucheron', 'Bvlgari', 'Sunlight', 'Sokolov', 'De Beers', 'Graff', 'Эстет', 'Прочее'],
  watch_lux: ['Casio', 'Seiko', 'Tissot', 'Citizen', 'Orient', 'Garmin', 'Suunto', 'Timex', 'Hamilton', 'Frederique Constant'],
  ebike: ['STELS', 'Trek', 'Giant', 'Specialized', 'Forward', 'Stinger', 'Cannondale', 'Stark', 'Welt', 'Merida'],
  escooter: ['Xiaomi', 'Ninebot', 'Kugoo', 'Hiper', 'Wakers', 'Citymate', 'Acer', 'Aovo', 'BBR', 'Inmotion'],
  skateboard: ['Element', 'Santa Cruz', 'Plan B', 'Almost', 'Real', 'Юнион', 'Footwork', 'Anti Hero', 'Powell Peralta', 'Прочее'],
  music_instrument: ['Yamaha', 'Casio', 'Fender', 'Gibson', 'Roland', 'Korg', 'Cort', 'Ibanez', 'Squier', 'Прочее'],
  sports: ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Decathlon', 'Demix', 'Asics', 'Wilson', 'Прочее'],
  book: ['АСТ', 'ЭКСМО', 'Манн, Иванов и Фербер', 'Питер', 'O\'Reilly', 'Pearson', 'Penguin', 'Pleasant Music', 'Прочее', 'Самиздат'],
  collectibles: ['LEGO', 'Funko', 'Hasbro', 'Mattel', 'Magic the Gathering', 'Pokémon TCG', 'Russian Post', 'Прочее', 'Самодел', 'Бонистика'],
  test: ['Тест'],
  other: ['Прочее'],
};


// Хелперы для краткости в спеках
const iCommon = (chip: string, ram: string, storage: string, screen: string, cam: string): ProductSpecs => ({
  Чип: chip, RAM: ram, Хранилище: storage, Экран: screen, Камера: cam,
});

const BASE_PRESET_MODELS: PresetModel[] = [
  // ===== iPhone =====
  { title: 'iPhone 11 64GB', category: 'smartphone', description: 'A13 Bionic, 6.1" Liquid Retina HD',
    specs: iCommon('Apple A13 Bionic', '4 GB', '64 GB', '6.1" Liquid Retina HD', '12 + 12 МП') },
  { title: 'iPhone 11 128GB', category: 'smartphone', description: 'A13 Bionic, 6.1" Liquid Retina HD',
    specs: iCommon('Apple A13 Bionic', '4 GB', '128 GB', '6.1" Liquid Retina HD', '12 + 12 МП') },
  { title: 'iPhone 12 mini 128GB', category: 'smartphone', description: 'A14 Bionic, 5.4" OLED, MagSafe',
    specs: iCommon('Apple A14 Bionic', '4 GB', '128 GB', '5.4" Super Retina XDR OLED', '12 + 12 МП') },
  { title: 'iPhone 12 128GB', category: 'smartphone', description: 'A14 Bionic, 6.1" OLED, MagSafe',
    specs: iCommon('Apple A14 Bionic', '4 GB', '128 GB', '6.1" Super Retina XDR OLED', '12 + 12 МП') },
  { title: 'iPhone 12 Pro 256GB', category: 'smartphone', description: 'A14 Bionic, LiDAR, ProRAW',
    specs: iCommon('Apple A14 Bionic', '6 GB', '256 GB', '6.1" OLED', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 12 Pro Max 256GB', category: 'smartphone', description: '6.7" OLED, тройная камера + LiDAR',
    specs: iCommon('Apple A14 Bionic', '6 GB', '256 GB', '6.7" OLED', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 13 mini 128GB', category: 'smartphone', description: 'A15 Bionic, 5.4" OLED, ProMotion',
    specs: iCommon('Apple A15 Bionic', '4 GB', '128 GB', '5.4" OLED', '12 + 12 МП') },
  { title: 'iPhone 13 128GB', category: 'smartphone', description: 'A15 Bionic, кино-режим',
    specs: iCommon('Apple A15 Bionic', '4 GB', '128 GB', '6.1" OLED', '12 + 12 МП') },
  { title: 'iPhone 13 256GB', category: 'smartphone', description: 'A15 Bionic',
    specs: iCommon('Apple A15 Bionic', '4 GB', '256 GB', '6.1" OLED', '12 + 12 МП') },
  { title: 'iPhone 13 Pro 128GB', category: 'smartphone', description: 'A15 Bionic, ProMotion 120 Гц',
    specs: iCommon('Apple A15 Bionic', '6 GB', '128 GB', '6.1" OLED ProMotion 120 Гц', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 13 Pro 256GB', category: 'smartphone', description: 'A15 Bionic, ProMotion 120 Гц',
    specs: iCommon('Apple A15 Bionic', '6 GB', '256 GB', '6.1" OLED ProMotion 120 Гц', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 13 Pro Max 256GB', category: 'smartphone', description: '6.7" ProMotion, LiDAR',
    specs: iCommon('Apple A15 Bionic', '6 GB', '256 GB', '6.7" OLED ProMotion', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 13 Pro Max 1TB', category: 'smartphone', description: '6.7" ProMotion, максимум памяти',
    specs: iCommon('Apple A15 Bionic', '6 GB', '1 TB', '6.7" OLED ProMotion', 'Тройная 12 МП + LiDAR') },
  { title: 'iPhone 14 128GB', category: 'smartphone', description: 'A15 Bionic, улучшенная камера',
    specs: iCommon('Apple A15 Bionic', '6 GB', '128 GB', '6.1" Super Retina XDR', '12 + 12 МП') },
  { title: 'iPhone 14 256GB', category: 'smartphone', description: 'A15 Bionic',
    specs: iCommon('Apple A15 Bionic', '6 GB', '256 GB', '6.1" Super Retina XDR', '12 + 12 МП') },
  { title: 'iPhone 14 Plus 256GB', category: 'smartphone', description: '6.7" Liquid Retina, большая батарея',
    specs: iCommon('Apple A15 Bionic', '6 GB', '256 GB', '6.7" Super Retina XDR', '12 + 12 МП') },
  { title: 'iPhone 14 Pro 128GB', category: 'smartphone', description: 'A16, Dynamic Island, 48 МП',
    specs: iCommon('Apple A16 Bionic', '6 GB', '128 GB', '6.1" ProMotion 120 Гц', '48 + 12 + 12 МП + LiDAR') },
  { title: 'iPhone 14 Pro 256GB', category: 'smartphone', description: 'A16, Dynamic Island, 48 МП',
    specs: iCommon('Apple A16 Bionic', '6 GB', '256 GB', '6.1" ProMotion 120 Гц', '48 + 12 + 12 МП + LiDAR') },
  { title: 'iPhone 14 Pro Max 256GB', category: 'smartphone', description: '6.7" ProMotion, Dynamic Island',
    specs: iCommon('Apple A16 Bionic', '6 GB', '256 GB', '6.7" ProMotion 120 Гц', '48 + 12 + 12 МП + LiDAR') },
  { title: 'iPhone 14 Pro Max 1TB', category: 'smartphone', description: '6.7", максимум памяти',
    specs: iCommon('Apple A16 Bionic', '6 GB', '1 TB', '6.7" ProMotion 120 Гц', '48 + 12 + 12 МП + LiDAR') },
  { title: 'iPhone 15 128GB', category: 'smartphone', description: 'A16 Bionic, USB-C',
    specs: { ...iCommon('Apple A16 Bionic', '6 GB', '128 GB', '6.1" Super Retina XDR', '48 + 12 МП'), Порт: 'USB-C' } },
  { title: 'iPhone 15 256GB', category: 'smartphone', description: 'A16 Bionic, USB-C',
    specs: { ...iCommon('Apple A16 Bionic', '6 GB', '256 GB', '6.1" Super Retina XDR', '48 + 12 МП'), Порт: 'USB-C' } },
  { title: 'iPhone 15 Plus 256GB', category: 'smartphone', description: '6.7", USB-C',
    specs: { ...iCommon('Apple A16 Bionic', '6 GB', '256 GB', '6.7" Super Retina XDR', '48 + 12 МП'), Порт: 'USB-C' } },
  { title: 'iPhone 15 Pro 128GB', category: 'smartphone', description: 'A17 Pro, титан, USB-C 3.0',
    specs: { ...iCommon('Apple A17 Pro', '8 GB', '128 GB', '6.1" ProMotion 120 Гц', '48 + 12 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 15 Pro 256GB', category: 'smartphone', description: 'A17 Pro, титан',
    specs: { ...iCommon('Apple A17 Pro', '8 GB', '256 GB', '6.1" ProMotion 120 Гц', '48 + 12 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 15 Pro Max 256GB', category: 'smartphone', description: '6.7", перископ 5×, титан',
    specs: { ...iCommon('Apple A17 Pro', '8 GB', '256 GB', '6.7" ProMotion 120 Гц', '48 + 12 + 12 МП, зум 5×'), Корпус: 'титан' } },
  { title: 'iPhone 15 Pro Max 512GB', category: 'smartphone', description: '6.7", перископ 5×, титан',
    specs: { ...iCommon('Apple A17 Pro', '8 GB', '512 GB', '6.7" ProMotion 120 Гц', '48 + 12 + 12 МП, зум 5×'), Корпус: 'титан' } },
  { title: 'iPhone 15 Pro Max 1TB', category: 'smartphone', description: '6.7", максимум памяти, титан',
    specs: { ...iCommon('Apple A17 Pro', '8 GB', '1 TB', '6.7" ProMotion 120 Гц', '48 + 12 + 12 МП, зум 5×'), Корпус: 'титан' } },
  { title: 'iPhone 16 128GB', category: 'smartphone', description: 'A18, Apple Intelligence, Camera Control',
    specs: iCommon('Apple A18', '8 GB', '128 GB', '6.1" Super Retina XDR', '48 + 12 МП') },
  { title: 'iPhone 16 256GB', category: 'smartphone', description: 'A18, Camera Control',
    specs: iCommon('Apple A18', '8 GB', '256 GB', '6.1" Super Retina XDR', '48 + 12 МП') },
  { title: 'iPhone 16 Plus 256GB', category: 'smartphone', description: '6.7", A18',
    specs: iCommon('Apple A18', '8 GB', '256 GB', '6.7" Super Retina XDR', '48 + 12 МП') },
  { title: 'iPhone 16 Pro 256GB', category: 'smartphone', description: 'A18 Pro, 6.3" ProMotion',
    specs: { ...iCommon('Apple A18 Pro', '8 GB', '256 GB', '6.3" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 16 Pro 512GB', category: 'smartphone', description: 'A18 Pro, 6.3" ProMotion',
    specs: { ...iCommon('Apple A18 Pro', '8 GB', '512 GB', '6.3" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 16 Pro Max 256GB', category: 'smartphone', description: '6.9", A18 Pro',
    specs: { ...iCommon('Apple A18 Pro', '8 GB', '256 GB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 16 Pro Max 1TB', category: 'smartphone', description: '6.9", максимум памяти',
    specs: { ...iCommon('Apple A18 Pro', '8 GB', '1 TB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 17 128GB', category: 'smartphone', description: 'A19, Apple Intelligence',
    specs: iCommon('Apple A19', '8 GB', '128 GB', '6.3" Super Retina XDR', '48 + 12 МП') },
  { title: 'iPhone 17 Pro 256GB', category: 'smartphone', description: 'A19 Pro, ProMotion',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '256 GB', '6.3" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 17 Pro Max 256GB', category: 'smartphone', description: '6.9", A19 Pro',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '256 GB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 17 Pro Max 512GB', category: 'smartphone', description: '6.9", A19 Pro',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '512 GB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан' } },
  { title: 'iPhone 17 Pro Max 1TB Silver', category: 'smartphone', description: '6.9", максимум памяти, серебристый',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '1 TB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан', Цвет: 'Silver' } },
  { title: 'iPhone 17 Pro Max 1TB Black', category: 'smartphone', description: '6.9", максимум памяти, чёрный',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '1 TB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан', Цвет: 'Black' } },
  { title: 'iPhone 17 Pro Max 1TB Cosmic Orange', category: 'smartphone', description: '6.9", максимум памяти, оранжевый',
    specs: { ...iCommon('Apple A19 Pro', '12 GB', '1 TB', '6.9" ProMotion 120 Гц', '48 + 48 + 12 МП'), Корпус: 'титан', Цвет: 'Cosmic Orange' } },
  { title: 'iPhone SE (2022) 64GB', category: 'smartphone', description: 'A15, Touch ID, 4.7"',
    specs: iCommon('Apple A15 Bionic', '4 GB', '64 GB', '4.7" Retina HD', '12 МП') },
  { title: 'iPhone SE 4 128GB', category: 'smartphone', description: 'A18, 6.1" OLED, USB-C',
    specs: { ...iCommon('Apple A18', '8 GB', '128 GB', '6.1" OLED', '48 МП'), Порт: 'USB-C' } },

  // ===== Samsung Galaxy =====
  { title: 'Samsung Galaxy S22 256GB', category: 'smartphone', description: 'Exynos 2200, 120 Гц AMOLED',
    specs: iCommon('Exynos 2200 / SD 8 Gen 1', '8 GB', '256 GB', '6.1" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S22 Ultra 256GB', category: 'smartphone', description: 'S Pen, 108 МП',
    specs: { ...iCommon('Exynos 2200', '12 GB', '256 GB', '6.8" Dynamic AMOLED 120 Гц', '108 + 12 + 10 + 10 МП'), 'S Pen': 'встроен' } },
  { title: 'Samsung Galaxy S23 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2 for Galaxy',
    specs: iCommon('Snapdragon 8 Gen 2 for Galaxy', '8 GB', '256 GB', '6.1" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S23+ 256GB', category: 'smartphone', description: '6.6", Snapdragon 8 Gen 2',
    specs: iCommon('Snapdragon 8 Gen 2', '8 GB', '256 GB', '6.6" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S23 Ultra 512GB', category: 'smartphone', description: 'S Pen, 200 МП',
    specs: { ...iCommon('Snapdragon 8 Gen 2', '12 GB', '512 GB', '6.8" Dynamic AMOLED 120 Гц', '200 + 12 + 10 + 10 МП'), 'S Pen': 'встроен' } },
  { title: 'Samsung Galaxy S23 FE 256GB', category: 'smartphone', description: 'Exynos 2200, AMOLED 120 Гц',
    specs: iCommon('Exynos 2200', '8 GB', '256 GB', '6.4" Dynamic AMOLED 120 Гц', '50 + 12 + 8 МП') },
  { title: 'Samsung Galaxy S24 256GB', category: 'smartphone', description: 'Galaxy AI, 6.2"',
    specs: iCommon('Snapdragon 8 Gen 3 / Exynos 2400', '8 GB', '256 GB', '6.2" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S24+ 256GB', category: 'smartphone', description: 'Galaxy AI, 6.7"',
    specs: iCommon('Snapdragon 8 Gen 3 / Exynos 2400', '12 GB', '256 GB', '6.7" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S24 Ultra 512GB', category: 'smartphone', description: 'Galaxy AI, S Pen, 200 МП',
    specs: { ...iCommon('Snapdragon 8 Gen 3 for Galaxy', '12 GB', '512 GB', '6.8" Dynamic AMOLED 120 Гц', '200 + 50 + 12 + 10 МП'), 'S Pen': 'встроен' } },
  { title: 'Samsung Galaxy S25 256GB', category: 'smartphone', description: 'Snapdragon 8 Elite, Galaxy AI',
    specs: iCommon('Snapdragon 8 Elite for Galaxy', '12 GB', '256 GB', '6.2" Dynamic AMOLED 120 Гц', '50 + 12 + 10 МП') },
  { title: 'Samsung Galaxy S25 Ultra 512GB', category: 'smartphone', description: 'S Pen, 200 МП',
    specs: { ...iCommon('Snapdragon 8 Elite for Galaxy', '12 GB', '512 GB', '6.9" Dynamic AMOLED 120 Гц', '200 + 50 + 50 + 10 МП'), 'S Pen': 'встроен' } },
  { title: 'Samsung Galaxy A35 5G 256GB', category: 'smartphone', description: 'Exynos 1380, AMOLED 120 Гц',
    specs: iCommon('Exynos 1380', '8 GB', '256 GB', '6.6" Super AMOLED 120 Гц', '50 + 8 + 5 МП') },
  { title: 'Samsung Galaxy A55 5G 256GB', category: 'smartphone', description: 'Exynos 1480, IP67',
    specs: iCommon('Exynos 1480', '8 GB', '256 GB', '6.6" Super AMOLED 120 Гц', '50 + 12 + 5 МП') },
  { title: 'Samsung Galaxy Z Flip 5 256GB', category: 'smartphone', description: 'Складной, Cover Display',
    specs: { ...iCommon('Snapdragon 8 Gen 2 for Galaxy', '8 GB', '256 GB', '6.7" Dynamic AMOLED', '12 + 12 МП'), Тип: 'складной (Flip)' } },
  { title: 'Samsung Galaxy Z Fold 5 512GB', category: 'smartphone', description: 'Складной планшетофон',
    specs: { ...iCommon('Snapdragon 8 Gen 2 for Galaxy', '12 GB', '512 GB', '7.6" Dynamic AMOLED', '50 + 12 + 10 МП'), Тип: 'складной (Fold)' } },

  // ===== Xiaomi / Redmi / POCO =====
  { title: 'Xiaomi 12 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 1',
    specs: iCommon('Snapdragon 8 Gen 1', '8 GB', '256 GB', '6.28" AMOLED 120 Гц', '50 + 13 + 5 МП') },
  { title: 'Xiaomi 13 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2, Leica',
    specs: iCommon('Snapdragon 8 Gen 2', '8 GB', '256 GB', '6.36" AMOLED 120 Гц', '50 + 10 + 12 МП (Leica)') },
  { title: 'Xiaomi 13 Pro 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2, 1" сенсор',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '512 GB', '6.73" AMOLED 120 Гц', '50 + 50 + 50 МП (Leica)') },
  { title: 'Xiaomi 14 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3, Leica',
    specs: iCommon('Snapdragon 8 Gen 3', '12 GB', '256 GB', '6.36" LTPO AMOLED', '50 + 50 + 50 МП (Leica)') },
  { title: 'Xiaomi 14 Pro 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3, Leica',
    specs: iCommon('Snapdragon 8 Gen 3', '12 GB', '512 GB', '6.73" LTPO AMOLED', '50 + 50 + 50 МП (Leica)') },
  { title: 'Xiaomi 14 Ultra 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3, Leica, 1" сенсор',
    specs: iCommon('Snapdragon 8 Gen 3', '16 GB', '512 GB', '6.73" LTPO AMOLED 120 Гц', '50 (1" сенсор) + 50 + 50 + 50 МП') },
  { title: 'Xiaomi Redmi Note 12 Pro 256GB', category: 'smartphone', description: 'Dimensity 1080',
    specs: iCommon('MediaTek Dimensity 1080', '8 GB', '256 GB', '6.67" AMOLED 120 Гц', '50 + 8 + 2 МП') },
  { title: 'Xiaomi Redmi Note 13 Pro+ 512GB', category: 'smartphone', description: '200 МП, 120 Вт',
    specs: iCommon('MediaTek Dimensity 7200-Ultra', '12 GB', '512 GB', '6.67" AMOLED 120 Гц', '200 + 8 + 2 МП') },
  { title: 'Xiaomi Redmi Note 14 Pro 256GB', category: 'smartphone', description: 'Dimensity 7300-Ultra',
    specs: iCommon('MediaTek Dimensity 7300-Ultra', '8 GB', '256 GB', '6.67" AMOLED 120 Гц', '200 + 8 + 2 МП') },
  { title: 'Xiaomi POCO F5 Pro 256GB', category: 'smartphone', description: 'Snapdragon 8+ Gen 1',
    specs: iCommon('Snapdragon 8+ Gen 1', '12 GB', '256 GB', '6.67" AMOLED 120 Гц', '64 + 8 + 2 МП') },
  { title: 'Xiaomi POCO F6 Pro 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '512 GB', '6.67" AMOLED 120 Гц', '50 + 8 + 2 МП') },
  { title: 'Xiaomi POCO X6 Pro 256GB', category: 'smartphone', description: 'Dimensity 8300-Ultra',
    specs: iCommon('MediaTek Dimensity 8300-Ultra', '12 GB', '256 GB', '6.67" AMOLED 120 Гц', '64 + 8 + 2 МП') },

  // ===== Google Pixel =====
  { title: 'Google Pixel 7 128GB', category: 'smartphone', description: 'Tensor G2, чистый Android',
    specs: iCommon('Google Tensor G2', '8 GB', '128 GB', '6.3" OLED 90 Гц', '50 + 12 МП') },
  { title: 'Google Pixel 7 Pro 256GB', category: 'smartphone', description: 'Tensor G2, перископ 5×',
    specs: iCommon('Google Tensor G2', '12 GB', '256 GB', '6.7" LTPO OLED 120 Гц', '50 + 12 + 48 МП') },
  { title: 'Google Pixel 8 128GB', category: 'smartphone', description: 'Tensor G3',
    specs: iCommon('Google Tensor G3', '8 GB', '128 GB', '6.2" OLED 120 Гц', '50 + 12 МП') },
  { title: 'Google Pixel 8 Pro 256GB', category: 'smartphone', description: 'Tensor G3, 50 МП теле',
    specs: iCommon('Google Tensor G3', '12 GB', '256 GB', '6.7" LTPO OLED 120 Гц', '50 + 48 + 48 МП') },
  { title: 'Google Pixel 9 128GB', category: 'smartphone', description: 'Tensor G4, Gemini AI',
    specs: iCommon('Google Tensor G4', '12 GB', '128 GB', '6.3" OLED 120 Гц', '50 + 48 МП') },
  { title: 'Google Pixel 9 Pro 256GB', category: 'smartphone', description: 'Tensor G4, перископ',
    specs: iCommon('Google Tensor G4', '16 GB', '256 GB', '6.3" LTPO OLED 120 Гц', '50 + 48 + 48 МП') },
  { title: 'Google Pixel 9 Pro XL 512GB', category: 'smartphone', description: '6.8", Tensor G4',
    specs: iCommon('Google Tensor G4', '16 GB', '512 GB', '6.8" LTPO OLED 120 Гц', '50 + 48 + 48 МП') },

  // ===== Honor / Huawei / OPPO / vivo / Realme / Sony / OnePlus / Tecno =====
  { title: 'Honor Magic 5 Pro 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '256 GB', '6.81" LTPO OLED 120 Гц', '50 + 50 + 50 МП') },
  { title: 'Honor Magic 6 Pro 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3',
    specs: iCommon('Snapdragon 8 Gen 3', '12 GB', '512 GB', '6.8" LTPO OLED 120 Гц', '50 + 180 + 50 МП') },
  { title: 'Honor 200 Pro 256GB', category: 'smartphone', description: 'Snapdragon 8s Gen 3',
    specs: iCommon('Snapdragon 8s Gen 3', '12 GB', '256 GB', '6.78" OLED 120 Гц', '50 + 50 + 12 МП') },
  { title: 'Honor Magic V2 16/512', category: 'smartphone', description: 'Складной флагман',
    specs: { ...iCommon('Snapdragon 8 Gen 2', '16 GB', '512 GB', '7.92" + 6.43" OLED', '50 + 50 + 20 МП'), Тип: 'складной' } },
  { title: 'OnePlus 11 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2, Hasselblad',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '256 GB', '6.7" LTPO AMOLED 120 Гц', '50 + 48 + 32 МП') },
  { title: 'OnePlus 12 512GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3',
    specs: iCommon('Snapdragon 8 Gen 3', '16 GB', '512 GB', '6.82" LTPO AMOLED 120 Гц', '50 + 48 + 64 МП') },
  { title: 'OnePlus Nord 3 5G 256GB', category: 'smartphone', description: 'Dimensity 9000',
    specs: iCommon('MediaTek Dimensity 9000', '16 GB', '256 GB', '6.74" AMOLED 120 Гц', '50 + 8 + 2 МП') },
  { title: 'Sony Xperia 1 V 256GB', category: 'smartphone', description: '4K 21:9 OLED, Snapdragon 8 Gen 2',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '256 GB', '6.5" 4K OLED 120 Гц 21:9', '48 + 12 + 12 МП') },
  { title: 'Sony Xperia 5 V 256GB', category: 'smartphone', description: 'Компактный флагман',
    specs: iCommon('Snapdragon 8 Gen 2', '8 GB', '256 GB', '6.1" OLED 120 Гц', '52 + 12 МП') },
  { title: 'OPPO Find X6 Pro 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 2, Hasselblad',
    specs: iCommon('Snapdragon 8 Gen 2', '12 GB', '256 GB', '6.82" LTPO AMOLED 120 Гц', '50 + 50 + 50 МП') },
  { title: 'OPPO A78 5G 128GB', category: 'smartphone', description: 'Dimensity 700',
    specs: iCommon('MediaTek Dimensity 700', '8 GB', '128 GB', '6.56" IPS 90 Гц', '50 + 2 МП') },
  { title: 'vivo X100 Pro 512GB', category: 'smartphone', description: 'Dimensity 9300, Zeiss',
    specs: iCommon('MediaTek Dimensity 9300', '16 GB', '512 GB', '6.78" LTPO AMOLED 120 Гц', '50 + 50 + 50 МП (Zeiss)') },
  { title: 'Realme GT 5 Pro 256GB', category: 'smartphone', description: 'Snapdragon 8 Gen 3',
    specs: iCommon('Snapdragon 8 Gen 3', '12 GB', '256 GB', '6.78" AMOLED 144 Гц', '50 + 8 + 50 МП') },
  { title: 'Tecno Camon 30 256GB', category: 'smartphone', description: 'Dimensity 7050',
    specs: iCommon('MediaTek Dimensity 7050', '8 GB', '256 GB', '6.78" AMOLED 120 Гц', '50 + 2 МП') },

  // ===== MacBook =====
  { title: 'MacBook Air 13" M1 256GB', category: 'laptop', description: 'Без вентилятора, тихий',
    specs: { Процессор: 'Apple M1', 'Кол-во ядер CPU': '8', 'Кол-во ядер GPU': '7-8', RAM: '8 GB', Хранилище: '256 GB SSD', Экран: '13.3" Retina (2560×1600)', Вес: '1.29 кг' } },
  { title: 'MacBook Air 13" M2 256GB', category: 'laptop', description: 'MagSafe, 4 цвета',
    specs: { Процессор: 'Apple M2', 'Кол-во ядер CPU': '8', RAM: '8 GB', Хранилище: '256 GB SSD', Экран: '13.6" Liquid Retina (2560×1664)', Вес: '1.24 кг' } },
  { title: 'MacBook Air 15" M2 512GB', category: 'laptop', description: 'Большой экран Air',
    specs: { Процессор: 'Apple M2', RAM: '8 GB', Хранилище: '512 GB SSD', Экран: '15.3" Liquid Retina', Вес: '1.51 кг' } },
  { title: 'MacBook Air 13" M3 512GB', category: 'laptop', description: 'M3, до 18 ч работы',
    specs: { Процессор: 'Apple M3', RAM: '16 GB', Хранилище: '512 GB SSD', Экран: '13.6" Liquid Retina' } },
  { title: 'MacBook Air 15" M4 512GB', category: 'laptop', description: 'Apple M4',
    specs: { Процессор: 'Apple M4', RAM: '16 GB', Хранилище: '512 GB SSD', Экран: '15.3" Liquid Retina' } },
  { title: 'MacBook Pro 14" M2 Pro 512GB', category: 'laptop', description: 'mini-LED ProMotion',
    specs: { Процессор: 'Apple M2 Pro', RAM: '16 GB', Хранилище: '512 GB SSD', Экран: '14.2" Liquid Retina XDR ProMotion' } },
  { title: 'MacBook Pro 14" M3 Pro 512GB', category: 'laptop', description: 'M3 Pro',
    specs: { Процессор: 'Apple M3 Pro', RAM: '18 GB', Хранилище: '512 GB SSD', Экран: '14.2" Liquid Retina XDR ProMotion' } },
  { title: 'MacBook Pro 14" M4 Pro 1TB', category: 'laptop', description: 'M4 Pro, Space Black',
    specs: { Процессор: 'Apple M4 Pro', RAM: '24 GB', Хранилище: '1 TB SSD', Экран: '14.2" Liquid Retina XDR ProMotion' } },
  { title: 'MacBook Pro 16" M3 Max 1TB', category: 'laptop', description: 'Топ Apple Silicon для контента',
    specs: { Процессор: 'Apple M3 Max', RAM: '36 GB', Хранилище: '1 TB SSD', Экран: '16.2" Liquid Retina XDR ProMotion' } },
  { title: 'MacBook Pro 16" M4 Max 2TB', category: 'laptop', description: 'M4 Max, максимальная конфигурация',
    specs: { Процессор: 'Apple M4 Max', RAM: '64 GB', Хранилище: '2 TB SSD', Экран: '16.2" Liquid Retina XDR ProMotion' } },

  // ===== Windows ноутбуки =====
  { title: 'ASUS ROG Strix G16', category: 'laptop', description: 'Игровой 16", RTX 4070',
    specs: { Процессор: 'Intel Core i7-13650HX', RAM: '16 GB DDR5', 'Видеокарта': 'NVIDIA RTX 4070 8 GB', Хранилище: '1 TB SSD', Экран: '16" QHD+ 240 Гц' } },
  { title: 'ASUS ZenBook 14 OLED', category: 'laptop', description: 'Лёгкий ультрабук с OLED',
    specs: { Процессор: 'Intel Core Ultra 7', RAM: '16 GB LPDDR5', Хранилище: '1 TB SSD', Экран: '14" OLED 2.8K 120 Гц' } },
  { title: 'Lenovo ThinkPad X1 Carbon Gen 12', category: 'laptop', description: 'Бизнес-флагман',
    specs: { Процессор: 'Intel Core Ultra 7', RAM: '16 GB', Хранилище: '1 TB SSD', Экран: '14" 2.8K OLED', Вес: '1.09 кг' } },
  { title: 'Lenovo Legion 5 Pro 16', category: 'laptop', description: 'Игровой ноутбук',
    specs: { Процессор: 'AMD Ryzen 7', RAM: '16 GB DDR5', 'Видеокарта': 'NVIDIA RTX 4060 8 GB', Хранилище: '1 TB SSD', Экран: '16" QHD 165 Гц' } },
  { title: 'HP Pavilion 15', category: 'laptop', description: 'Универсальный 15"',
    specs: { Процессор: 'Intel Core i5', RAM: '16 GB', Хранилище: '512 GB SSD', Экран: '15.6" FHD IPS' } },
  { title: 'Acer Nitro V 15', category: 'laptop', description: 'Бюджетный игровой',
    specs: { Процессор: 'Intel Core i5', RAM: '16 GB', 'Видеокарта': 'NVIDIA RTX 4050', Хранилище: '512 GB SSD', Экран: '15.6" FHD 144 Гц' } },
  { title: 'MSI Cyborg 15 A12V', category: 'laptop', description: 'Игровой с RTX 4060',
    specs: { Процессор: 'Intel Core i7-12650H', RAM: '16 GB', 'Видеокарта': 'NVIDIA RTX 4060', Хранилище: '512 GB SSD' } },
  { title: 'Asus Eee PC 1015PX (нетбук)', category: 'laptop', description: 'Классический нетбук',
    specs: { Процессор: 'Intel Atom N570', RAM: '2 GB DDR3', Хранилище: '320 GB HDD', Экран: '10.1" WSVGA', 'Тип': 'нетбук' } },
  { title: 'Asus Eee PC 1005HA', category: 'laptop', description: 'Нетбук 10.1"',
    specs: { Процессор: 'Intel Atom N280', RAM: '1 GB', Хранилище: '160 GB HDD', Экран: '10.1"', 'Тип': 'нетбук' } },

  // ===== Планшеты =====
  { title: 'iPad 9 64GB Wi-Fi', category: 'tablet', description: 'A13, 10.2"',
    specs: { Чип: 'Apple A13 Bionic', Хранилище: '64 GB', Экран: '10.2" Retina', Связь: 'Wi-Fi' } },
  { title: 'iPad 10 64GB Wi-Fi', category: 'tablet', description: 'A14, 10.9", USB-C',
    specs: { Чип: 'Apple A14 Bionic', Хранилище: '64 GB', Экран: '10.9" Liquid Retina', Порт: 'USB-C' } },
  { title: 'iPad mini 6 64GB', category: 'tablet', description: '8.3" Liquid Retina, A15',
    specs: { Чип: 'Apple A15 Bionic', Хранилище: '64 GB', Экран: '8.3" Liquid Retina' } },
  { title: 'iPad mini 7 128GB', category: 'tablet', description: 'A17 Pro, Apple Intelligence',
    specs: { Чип: 'Apple A17 Pro', Хранилище: '128 GB', Экран: '8.3" Liquid Retina' } },
  { title: 'iPad Air 11" M2 128GB', category: 'tablet', description: 'Apple M2, Pencil Pro',
    specs: { Чип: 'Apple M2', Хранилище: '128 GB', Экран: '11" Liquid Retina', 'Apple Pencil': 'Pro поддерживается' } },
  { title: 'iPad Air 13" M2 256GB', category: 'tablet', description: 'Большой Air',
    specs: { Чип: 'Apple M2', Хранилище: '256 GB', Экран: '13" Liquid Retina' } },
  { title: 'iPad Pro 11" M4 256GB', category: 'tablet', description: 'OLED ProMotion 120 Гц',
    specs: { Чип: 'Apple M4', Хранилище: '256 GB', Экран: '11" Ultra Retina XDR OLED 120 Гц' } },
  { title: 'iPad Pro 13" M4 512GB', category: 'tablet', description: 'OLED Tandem, ProMotion',
    specs: { Чип: 'Apple M4', Хранилище: '512 GB', Экран: '13" Ultra Retina XDR OLED 120 Гц' } },
  { title: 'Samsung Galaxy Tab S9 FE 128GB', category: 'tablet', description: 'S Pen, IP68',
    specs: { Чип: 'Exynos 1380', RAM: '6 GB', Хранилище: '128 GB', Экран: '10.9" LCD 90 Гц', 'S Pen': 'в комплекте' } },
  { title: 'Samsung Galaxy Tab S9 Ultra 256GB', category: 'tablet', description: '14.6" AMOLED, S Pen',
    specs: { Чип: 'Snapdragon 8 Gen 2 for Galaxy', RAM: '12 GB', Хранилище: '256 GB', Экран: '14.6" Dynamic AMOLED 2X 120 Гц', 'S Pen': 'в комплекте' } },
  { title: 'Xiaomi Pad 6 256GB', category: 'tablet', description: '11" 144 Гц, Snapdragon 870',
    specs: { Чип: 'Snapdragon 870', RAM: '8 GB', Хранилище: '256 GB', Экран: '11" IPS 144 Гц' } },

  // ===== Apple Watch =====
  { title: 'Apple Watch SE 2 40mm GPS', category: 'smartwatch', description: 'S8 SiP',
    specs: { Чип: 'Apple S8', Корпус: '40 мм', Связь: 'GPS', 'Always-On': 'нет' } },
  { title: 'Apple Watch Series 9 41mm GPS', category: 'smartwatch', description: 'Double Tap, S9',
    specs: { Чип: 'Apple S9', Корпус: '41 мм алюминий', Связь: 'GPS', 'Always-On': 'есть' } },
  { title: 'Apple Watch Series 10 42mm GPS', category: 'smartwatch', description: 'Тонкий корпус, OLED',
    specs: { Чип: 'Apple S10', Корпус: '42 мм алюминий', Связь: 'GPS' } },
  { title: 'Apple Watch Ultra 2 49mm', category: 'smartwatch', description: 'Титан, для спорта',
    specs: { Чип: 'Apple S9', Корпус: '49 мм титан', Связь: 'GPS + Cellular', Защита: 'IP6X, 100 м' } },

  // ===== Прочие smartwatch =====
  { title: 'Samsung Galaxy Watch 6 44mm', category: 'smartwatch', description: 'Wear OS, AMOLED',
    specs: { Чип: 'Exynos W930', Корпус: '44 мм', Связь: 'Bluetooth + Wi-Fi' } },
  { title: 'Garmin Fenix 7 Solar', category: 'smartwatch', description: 'Мультиспорт с солнечной зарядкой',
    specs: { Корпус: '47 мм нержавеющая сталь', Экран: '1.3"', 'Авт. работа': 'до 18 дней' } },
  { title: 'Garmin Forerunner 965', category: 'smartwatch', description: 'AMOLED для бегунов',
    specs: { Экран: '1.4" AMOLED', 'Авт. работа': 'до 23 дней' } },
  { title: 'Casio G-Shock GA-2100', category: 'watch_lux', description: 'Casioak, кварц',
    specs: { Механизм: 'кварц', Защита: '200 м', Корпус: '45 мм' } },
  { title: 'Xiaomi Smart Band 8', category: 'smartwatch', description: 'AMOLED фитнес-браслет',
    specs: { Экран: '1.62" AMOLED', 'Авт. работа': 'до 16 дней' } },

  // ===== Игровые консоли =====
  { title: 'PlayStation 5 Disc Edition 1TB', category: 'console', description: 'С дисководом',
    specs: { Поколение: 'Sony PS5', Хранилище: '825 GB SSD', Дисковод: 'Blu-ray UHD', Геймпад: 'DualSense' } },
  { title: 'PlayStation 5 Slim Digital 1TB', category: 'console', description: 'Без дисковода, slim',
    specs: { Поколение: 'Sony PS5 Slim', Хранилище: '1 TB SSD', Дисковод: 'нет (опц. отдельно)' } },
  { title: 'PlayStation 5 Pro 2TB', category: 'console', description: 'Ray-tracing, PSSR',
    specs: { Поколение: 'Sony PS5 Pro', Хранилище: '2 TB SSD', Дисковод: 'нет' } },
  { title: 'PlayStation 4 Slim 1TB', category: 'console', description: 'PS4 Slim',
    specs: { Поколение: 'Sony PS4 Slim', Хранилище: '1 TB HDD' } },
  { title: 'Xbox Series X 1TB', category: 'console', description: '4K 120 Гц',
    specs: { Поколение: 'Microsoft Xbox Series X', Хранилище: '1 TB NVMe SSD' } },
  { title: 'Xbox Series S 512GB', category: 'console', description: 'Цифровой младший',
    specs: { Поколение: 'Microsoft Xbox Series S', Хранилище: '512 GB NVMe SSD' } },
  { title: 'Nintendo Switch OLED', category: 'console', description: '7" OLED, гибрид',
    specs: { Поколение: 'Nintendo Switch (OLED)', Экран: '7" OLED 720p', Док: 'есть' } },
  { title: 'Nintendo Switch Lite', category: 'console', description: 'Только портатив',
    specs: { Поколение: 'Nintendo Switch Lite', Экран: '5.5" 720p' } },
  { title: 'Nintendo Switch 2', category: 'console', description: 'Новое поколение',
    specs: { Поколение: 'Nintendo Switch 2', Экран: '7.9" LCD HDR' } },
  { title: 'Valve Steam Deck OLED 1TB', category: 'console', description: 'Портативный PC',
    specs: { Поколение: 'Steam Deck OLED', Хранилище: '1 TB NVMe', Экран: '7.4" HDR OLED 90 Гц' } },

  // ===== Игры =====
  { title: 'God of War Ragnarok (PS5)', category: 'console_game', description: 'Sony Santa Monica', specs: { Платформа: 'PS5', Издатель: 'Sony', Жанр: 'Action-Adventure' } },
  { title: 'The Last of Us Part II Remastered (PS5)', category: 'console_game', description: 'Ремастер', specs: { Платформа: 'PS5', Издатель: 'Sony', Жанр: 'Action' } },
  { title: 'Spider-Man 2 (PS5)', category: 'console_game', description: 'Insomniac', specs: { Платформа: 'PS5', Издатель: 'Sony' } },
  { title: 'Cyberpunk 2077 Phantom Liberty (PS5)', category: 'console_game', description: 'CD Projekt RED', specs: { Платформа: 'PS5', Жанр: 'RPG' } },
  { title: 'Elden Ring (PS5)', category: 'console_game', description: 'FromSoftware', specs: { Платформа: 'PS5', Жанр: 'Soulslike' } },
  { title: 'Mortal Kombat 1 (PS5)', category: 'console_game', description: 'NetherRealm', specs: { Платформа: 'PS5', Жанр: 'Файтинг' } },
  { title: 'The Legend of Zelda: Tears of the Kingdom (Switch)', category: 'console_game', description: 'Nintendo', specs: { Платформа: 'Switch', Издатель: 'Nintendo' } },

  // ===== Наушники =====
  { title: 'AirPods 2', category: 'audio_headphones', description: 'Базовые с лайтинг кейсом',
    specs: { Тип: 'TWS вкладыши', ANC: 'нет', Кейс: 'Lightning' } },
  { title: 'AirPods 3', category: 'audio_headphones', description: 'Adaptive EQ',
    specs: { Тип: 'TWS вкладыши', ANC: 'нет', Кейс: 'MagSafe' } },
  { title: 'AirPods 4 ANC', category: 'audio_headphones', description: 'Шумоподавление',
    specs: { Тип: 'TWS вкладыши', ANC: 'есть' } },
  { title: 'AirPods Pro 2 (USB-C)', category: 'audio_headphones', description: 'H2, MagSafe, USB-C',
    specs: { Тип: 'TWS вкладыши', ANC: 'есть', Чип: 'Apple H2', Кейс: 'MagSafe USB-C' } },
  { title: 'AirPods Max', category: 'audio_headphones', description: 'Накладные, ANC',
    specs: { Тип: 'накладные', ANC: 'есть', Чип: 'Apple H1', Кейс: 'Smart Case' } },
  { title: 'Sony WH-1000XM4', category: 'audio_headphones', description: 'Накладные ANC',
    specs: { Тип: 'накладные', ANC: 'есть', 'Авт. работа': 'до 30 ч' } },
  { title: 'Sony WH-1000XM5', category: 'audio_headphones', description: 'Топ Sony',
    specs: { Тип: 'накладные', ANC: 'есть', 'Авт. работа': 'до 30 ч', Кодеки: 'LDAC, AAC, SBC' } },
  { title: 'Sony WF-1000XM5', category: 'audio_headphones', description: 'TWS с ANC',
    specs: { Тип: 'TWS вкладыши', ANC: 'есть', Кодеки: 'LDAC, AAC' } },
  { title: 'Bose QuietComfort Ultra', category: 'audio_headphones', description: 'Премиум ANC',
    specs: { Тип: 'накладные', ANC: 'есть', 'Авт. работа': 'до 24 ч' } },
  { title: 'Marshall Major IV', category: 'audio_headphones', description: 'Беспроводные накладные',
    specs: { Тип: 'накладные', ANC: 'нет', 'Авт. работа': 'до 80 ч' } },

  // ===== Колонки =====
  { title: 'JBL Charge 5', category: 'audio_speaker', description: 'Портативная, IP67',
    specs: { Мощность: '40 Вт', 'Авт. работа': 'до 20 ч', Защита: 'IP67' } },
  { title: 'JBL Flip 6', category: 'audio_speaker', description: 'Компактная',
    specs: { Мощность: '30 Вт', 'Авт. работа': 'до 12 ч', Защита: 'IP67' } },
  { title: 'Marshall Stockwell II', category: 'audio_speaker', description: 'Винтажный дизайн',
    specs: { Мощность: '20 Вт', 'Авт. работа': 'до 20 ч' } },
  { title: 'Marshall Acton III', category: 'audio_speaker', description: 'Домашняя стационарная',
    specs: { Мощность: '60 Вт', 'Тип': 'стационарная Wi-Fi/BT' } },
  { title: 'Sonos One SL', category: 'audio_speaker', description: 'Умная Wi-Fi',
    specs: { Тип: 'умная Wi-Fi колонка', 'Голосовой помощник': 'нет (SL)' } },
  { title: 'Яндекс Станция Макс', category: 'audio_speaker', description: 'С Алисой и Zigbee',
    specs: { Мощность: '65 Вт', Алиса: 'есть', Zigbee: 'есть' } },
  { title: 'VK Капсула Нео', category: 'audio_speaker', description: 'С Марусей',
    specs: { Маруся: 'есть' } },

  // ===== Телевизоры =====
  { title: 'LG OLED55C3', category: 'tv', description: 'OLED 4K 120 Гц',
    specs: { Диагональ: '55"', Разрешение: '4K UHD', Тип: 'OLED evo', HDR: 'Dolby Vision IQ' } },
  { title: 'LG OLED65G3', category: 'tv', description: 'Топовый OLED Gallery',
    specs: { Диагональ: '65"', Тип: 'OLED MLA', HDR: 'Dolby Vision' } },
  { title: 'Samsung QE55QN90C', category: 'tv', description: 'Neo QLED 4K',
    specs: { Диагональ: '55"', Тип: 'Neo QLED Mini LED', HDR: 'HDR10+' } },
  { title: 'Sony Bravia XR-65A95L', category: 'tv', description: 'QD-OLED топ Sony',
    specs: { Диагональ: '65"', Тип: 'QD-OLED', HDR: 'Dolby Vision' } },
  { title: 'Xiaomi TV A2 55"', category: 'tv', description: 'Бюджетный 4K Android TV',
    specs: { Диагональ: '55"', Разрешение: '4K UHD', ОС: 'Android TV' } },

  // ===== Камеры =====
  { title: 'Canon EOS R6 Mark II Body', category: 'camera', description: 'Полный кадр, 24 МП',
    specs: { Тип: 'беззеркальная', Матрица: 'Full-frame CMOS 24.2 МП', Видео: '4K 60p', Стабилизация: 'IBIS до 8 ст.' } },
  { title: 'Canon EOS R5', category: 'camera', description: '45 МП, 8K видео',
    specs: { Тип: 'беззеркальная', Матрица: 'Full-frame CMOS 45 МП', Видео: '8K RAW' } },
  { title: 'Sony Alpha A7 IV Body', category: 'camera', description: '33 МП Full-Frame',
    specs: { Тип: 'беззеркальная', Матрица: 'Full-frame 33 МП', Видео: '4K 60p 10-бит' } },
  { title: 'Sony Alpha A7C II', category: 'camera', description: 'Компактный полнокадровый',
    specs: { Тип: 'беззеркальная', Матрица: 'Full-frame 33 МП' } },
  { title: 'Nikon Z6 III', category: 'camera', description: 'Гибридный, 24 МП',
    specs: { Тип: 'беззеркальная', Матрица: 'Full-frame 24.5 МП', Видео: '6K 60p RAW' } },
  { title: 'Fujifilm X-T5 Body', category: 'camera', description: 'APS-C 40 МП',
    specs: { Тип: 'беззеркальная', Матрица: 'APS-C X-Trans 5 HR 40 МП' } },
  { title: 'Fujifilm X100VI', category: 'camera', description: 'Премиум-компакт с фиксом',
    specs: { Тип: 'компактная с фикс-объективом', Матрица: 'APS-C 40 МП', Объектив: '23 мм F2.0' } },

  // ===== Объективы =====
  { title: 'Canon RF 24-70mm F2.8L IS USM', category: 'camera_lens', description: 'Базовый зум', specs: { Байонет: 'Canon RF', 'Фокусное': '24–70 мм', 'Светосила': 'F2.8' } },
  { title: 'Sony FE 70-200mm F2.8 GM OSS II', category: 'camera_lens', description: 'Теле-зум премиум', specs: { Байонет: 'Sony E', 'Фокусное': '70–200 мм', 'Светосила': 'F2.8' } },
  { title: 'Sigma 35mm F1.4 DG DN Art (Sony E)', category: 'camera_lens', description: 'Светосильный фикс', specs: { Байонет: 'Sony E', 'Фокусное': '35 мм', 'Светосила': 'F1.4' } },

  // ===== Дроны =====
  { title: 'DJI Mini 4 Pro', category: 'drone', description: 'Складной, до 250 г',
    specs: { Вес: '<249 г', Камера: '1/1.3" CMOS, 4K HDR', 'Авт. работа': 'до 34 мин' } },
  { title: 'DJI Air 3', category: 'drone', description: '2 камеры',
    specs: { Камера: '1/1.3" (2 шт)', 'Авт. работа': 'до 46 мин' } },
  { title: 'DJI Mavic 3 Pro', category: 'drone', description: 'Hasselblad, 3 камеры',
    specs: { Камера: 'Hasselblad 4/3 CMOS + 2 теле', 'Авт. работа': 'до 43 мин' } },

  // ===== Электросамокаты =====
  { title: 'Xiaomi Mi Scooter Pro 2', category: 'escooter', description: '600 Вт пик',
    specs: { Мотор: '300 Вт (600 пик)', Дальность: 'до 45 км', 'Макс. скорость': '25 км/ч' } },
  { title: 'Xiaomi Mi Scooter 4 Pro', category: 'escooter', description: 'Топ Xiaomi',
    specs: { Мотор: '350 Вт', Дальность: 'до 55 км', 'Макс. скорость': '25 км/ч' } },
  { title: 'Ninebot KickScooter Max G30', category: 'escooter', description: 'Дальний пробег',
    specs: { Мотор: '350 Вт', Дальность: 'до 65 км', 'Макс. скорость': '25 км/ч' } },
  { title: 'Kugoo M5 Pro', category: 'escooter', description: 'Бюджетный взрослый',
    specs: { Мотор: '500 Вт', Дальность: 'до 35 км', 'Макс. скорость': '35 км/ч' } },

  // ===== Велосипеды =====
  { title: 'STELS Navigator 590 MD', category: 'ebike', description: 'Горный 26"',
    specs: { Тип: 'горный', Колёса: '26"', Скоростей: '21' } },
  { title: 'Trek Marlin 5', category: 'ebike', description: 'Хардтейл',
    specs: { Тип: 'горный хардтейл', Колёса: '29"', Скоростей: '16' } },
  { title: 'Giant Escape 3', category: 'ebike', description: 'Гибрид city/cross',
    specs: { Тип: 'городской/гибрид', Колёса: '700C', Скоростей: '21' } },

  // ===== Робот-пылесосы =====
  { title: 'Roborock Q7 Max+', category: 'appliance_clean', description: 'С самоочисткой контейнера',
    specs: { Тип: 'робот-пылесос', Всасывание: '4200 Pa', 'Сухая/влажная': 'обе' } },
  { title: 'Roborock S8 Pro Ultra', category: 'appliance_clean', description: 'Топ Roborock',
    specs: { Тип: 'робот-пылесос', Всасывание: '6000 Pa', 'Самоочистка станции': 'есть' } },
  { title: 'Xiaomi Robot Vacuum X10+', category: 'appliance_clean', description: 'С база-станцией',
    specs: { Тип: 'робот-пылесос', Всасывание: '4000 Pa' } },
  { title: 'Dyson V15 Detect Absolute', category: 'appliance_clean', description: 'Вертикальный, лазер',
    specs: { Тип: 'вертикальный аккумуляторный', Лазер: 'есть' } },

  // ===== Кофемашины и кухня =====
  { title: 'DeLonghi ECAM 23.460', category: 'appliance_kitchen', description: 'Зерновая кофемашина',
    specs: { Тип: 'автоматическая', Кофемолка: 'встроенная' } },
  { title: 'Philips EP3243/50', category: 'appliance_kitchen', description: 'Зерновая, LatteGo',
    specs: { Тип: 'автоматическая', Капучинатор: 'LatteGo' } },
  { title: 'Bosch MFW 3520', category: 'appliance_kitchen', description: 'Электромясорубка',
    specs: { Мощность: '1500 Вт' } },

  // ===== Холодильники, стирки, ТВ-приставки =====
  { title: 'LG GA-B509MQSL No Frost', category: 'appliance_large', description: 'Двухкамерный',
    specs: { Тип: 'двухкамерный', 'No Frost': 'есть' } },
  { title: 'Samsung WW70AG6S22A', category: 'appliance_large', description: 'Стиральная 7 кг',
    specs: { Загрузка: '7 кг', Отжим: '1200 об/мин', Управление: 'инвертор' } },
  { title: 'Bosch WAN24202OE', category: 'appliance_large', description: '8 кг, EcoSilence',
    specs: { Загрузка: '8 кг', Отжим: '1200 об/мин' } },

  // ===== Электроинструмент =====
  { title: 'Makita DHP488Z (дрель-шуруповёрт)', category: 'tool_power', description: 'LXT 18 В',
    specs: { Тип: 'аккумуляторная дрель-шуруповёрт', Напряжение: '18 В', АКБ: 'опц.' } },
  { title: 'DeWalt DCD777S2T', category: 'tool_power', description: 'Бесщёточная 18 В',
    specs: { Тип: 'дрель-шуруповёрт', Напряжение: '18 В', АКБ: '1.5 А·ч × 2' } },
  { title: 'Bosch GBH 2-26 (перфоратор)', category: 'tool_power', description: 'SDS-plus 2.7 Дж',
    specs: { Тип: 'перфоратор', 'Энергия удара': '2.7 Дж', 'Питание': 'сеть 230 В' } },
  { title: 'Makita HR2470 (перфоратор)', category: 'tool_power', description: 'SDS-plus 2.4 Дж',
    specs: { Тип: 'перфоратор', 'Энергия удара': '2.4 Дж', Мощность: '780 Вт', 'Питание': 'сеть 230 В', 'Скорость': '0–1100 об/мин' } },
  { title: 'Makita HR2470F (перфоратор с подсветкой)', category: 'tool_power', description: 'SDS-plus, с фонарём',
    specs: { Тип: 'перфоратор', 'Энергия удара': '2.4 Дж', Мощность: '780 Вт', 'Подсветка': 'есть' } },
  { title: 'Makita HR2630 (перфоратор)', category: 'tool_power', description: 'SDS-plus 2.4 Дж, реверс',
    specs: { Тип: 'перфоратор', 'Энергия удара': '2.4 Дж', Мощность: '800 Вт' } },
  { title: 'Makita GA9020 (УШМ 230 мм)', category: 'tool_power', description: 'Болгарка 2200 Вт',
    specs: { Диск: '230 мм', Мощность: '2200 Вт' } },
  { title: 'Makita HS7601J (пила дисковая)', category: 'tool_power', description: '190 мм, 1200 Вт',
    specs: { Диск: '190 мм', Мощность: '1200 Вт' } },

  // ===== Ручной инструмент =====
  { title: 'Knipex Cobra (клещи)', category: 'tool_hand', description: 'Сантехнические', specs: { Тип: 'клещи переставные' } },
  { title: 'Stanley FatMax (рулетка 8 м)', category: 'tool_hand', description: 'Профессиональная', specs: { Длина: '8 м', Класс: 'II' } },
  { title: 'Wera Kraftform набор отвёрток', category: 'tool_hand', description: '7 предметов', specs: { Количество: '7' } },

  // ===== Часы премиум =====
  { title: 'Seiko 5 Sports SRPD55', category: 'watch_lux', description: 'Механика автоподзавод', specs: { Механизм: 'автомат 4R36', Защита: '100 м', Корпус: '42.5 мм нерж. сталь' } },
  { title: 'Casio G-Shock GA-2100-1A', category: 'watch_lux', description: 'Casioak', specs: { Механизм: 'кварц', Защита: '200 м' } },
  { title: 'Tissot PRX 40 Powermatic 80', category: 'watch_lux', description: 'Швейцарская механика', specs: { Механизм: 'Powermatic 80', Защита: '100 м', Корпус: '40 мм' } },

  // ===== Золото / Ювелирка =====
  { title: 'Цепь золотая 585, 8г', category: 'gold', description: 'Бисмарк', specs: { Проба: '585', Вес: '8 г', Плетение: 'Бисмарк' } },
  { title: 'Цепь золотая 585, 12г', category: 'gold', description: 'Якорное', specs: { Проба: '585', Вес: '12 г', Плетение: 'Якорное' } },
  { title: 'Кольцо обручальное 585, 4г', category: 'gold', description: 'Классическое', specs: { Проба: '585', Вес: '4 г' } },
  { title: 'Серьги золотые 585, 2.5г', category: 'gold', description: 'Английский замок', specs: { Проба: '585', Вес: '2.5 г', Замок: 'английский' } },
  { title: 'Браслет золотой 585, 6г', category: 'gold', description: 'Нонна', specs: { Проба: '585', Вес: '6 г', Плетение: 'Нонна' } },
  { title: 'Слиток золотой 999, 5г', category: 'gold', description: 'Банковский', specs: { Проба: '999', Вес: '5 г' } },
  { title: 'Слиток золотой 999, 10г', category: 'gold', description: 'Банковский', specs: { Проба: '999', Вес: '10 г' } },
  { title: 'Цепь серебряная 925, 15г', category: 'silver', description: 'Якорное', specs: { Проба: '925', Вес: '15 г' } },
];

// Объединяем базовый набор и расширенный.
// Дубликаты убираем по title (case-insensitive) — базовый имеет приоритет.
function mergePresets(base: PresetModel[], extra: PresetModel[]): PresetModel[] {
  const seen = new Set(base.map((p) => p.title.toLowerCase()));
  const merged = [...base];
  for (const p of extra) {
    const k = p.title.toLowerCase();
    if (!seen.has(k)) {
      merged.push(p);
      seen.add(k);
    }
  }
  return merged;
}

export const PRESET_MODELS: PresetModel[] = mergePresets(BASE_PRESET_MODELS, EXTENDED_MODELS);

// ============ ПОИСК ============
// Token-based: разбиваем запрос на слова и требуем все токены в title.
// Можно ограничить категорией и/или брендом.
export interface SearchOptions {
  category?: ProductCategoryKey;
  brand?: string;
  limit?: number;
}

export function searchPresets(query: string, opts: SearchOptions = {}): PresetModel[] {
  const { category, brand, limit = 8 } = opts;
  const q = query.trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

  const matches: Array<{ p: PresetModel; score: number }> = [];
  for (const p of PRESET_MODELS) {
    if (category && p.category !== category) continue;
    if (brand && getBrand(p) !== brand) continue;
    const lower = p.title.toLowerCase();
    if (tokens.length > 0 && !tokens.every((t) => lower.includes(t))) continue;
    const score = tokens.length > 0 && lower.startsWith(tokens[0]) ? 0 : 1;
    matches.push({ p, score });
  }
  matches.sort((a, b) => a.score - b.score);
  return matches.slice(0, limit).map((m) => m.p);
}

/** Все уникальные бренды, реально встречающиеся в preset для категории. */
export function brandsInPresetsForCategory(category: ProductCategoryKey): string[] {
  const set = new Set<string>();
  for (const p of PRESET_MODELS) {
    if (p.category === category) set.add(getBrand(p));
  }
  return Array.from(set).sort();
}
