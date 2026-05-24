// Дополнительные пресет-модели — расширение основного preset-models.ts.
// Тут лежит ~250+ позиций по брендам, у которых много линеек: ASUS, Lenovo,
// HP, Acer, Dell, MSI ноутбуки + старые iPhone/Samsung + бытовая.

import type { PresetModel } from './preset-models';

// Хелпер: ноутбук с типовыми полями
const lap = (
  title: string,
  cpu: string,
  ram: string,
  storage: string,
  screen: string,
  gpu?: string,
  description = ''
): PresetModel => ({
  title,
  category: 'laptop',
  description,
  specs: {
    Процессор: cpu,
    RAM: ram,
    Хранилище: storage,
    Экран: screen,
    ...(gpu ? { Видеокарта: gpu } : {}),
  },
});

const phone = (
  title: string,
  chip: string,
  ram: string,
  storage: string,
  screen: string,
  cam: string,
  description = ''
): PresetModel => ({
  title,
  category: 'smartphone',
  description,
  specs: { Чип: chip, RAM: ram, Хранилище: storage, Экран: screen, Камера: cam },
});

export const EXTENDED_MODELS: PresetModel[] = [
  // ============ ASUS ноутбуки ============
  // ZenBook
  lap('ASUS ZenBook 13 UX325EA', 'Intel Core i5-1135G7', '8 GB', '512 GB SSD', '13.3" FHD OLED', undefined, 'Лёгкий ультрабук'),
  lap('ASUS ZenBook 14 UX425EA', 'Intel Core i5-1135G7', '8 GB', '512 GB SSD', '14" FHD IPS'),
  lap('ASUS ZenBook 14 UX5400', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" 2.8K OLED 90 Гц', 'Intel Iris Xe'),
  lap('ASUS ZenBook 14X OLED UX5401', 'Intel Core i7-12700H', '16 GB', '1 TB SSD', '14.5" 2.8K OLED', undefined, 'Workstation в ультрабуке'),
  lap('ASUS ZenBook 15 UX534FAC', 'Intel Core i7-10510U', '16 GB', '512 GB SSD', '15.6" FHD'),
  lap('ASUS ZenBook Duo UX482EA', 'Intel Core i7-1165G7', '16 GB', '1 TB SSD', '14" FHD + 12.6" ScreenPad', undefined, '2 экрана'),
  lap('ASUS ZenBook Pro 14 Duo UX8402', 'Intel Core i7-12700H', '16 GB', '1 TB SSD', '14.5" 2.8K OLED + 12.7" 2880×864', 'NVIDIA RTX 3050 Ti'),
  lap('ASUS ZenBook S 13 OLED UX5304', 'Intel Core i7-1355U', '16 GB', '1 TB SSD', '13.3" 2.8K OLED'),
  lap('ASUS ZenBook S 14 OLED UX5406', 'Intel Core Ultra 7 258V', '16 GB', '1 TB SSD', '14" 3K OLED'),

  // VivoBook
  lap('ASUS VivoBook 15 X512UA', 'Intel Core i3-7020U', '4 GB', '256 GB SSD', '15.6" FHD', undefined, 'Бюджетный 15"'),
  lap('ASUS VivoBook 15 X1500EA', 'Intel Core i3-1115G4', '8 GB', '256 GB SSD', '15.6" FHD'),
  lap('ASUS VivoBook 15 X1502ZA', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '15.6" FHD OLED'),
  lap('ASUS VivoBook 16X K3604ZA', 'Intel Core i5-1240P', '16 GB', '512 GB SSD', '16" WUXGA'),
  lap('ASUS VivoBook Pro 15 OLED M6500QH', 'AMD Ryzen 7 5800H', '16 GB', '512 GB SSD', '15.6" 2.8K OLED 120 Гц', 'NVIDIA GTX 1650'),
  lap('ASUS VivoBook Pro 16X OLED N7601ZW', 'Intel Core i7-12700H', '32 GB', '1 TB SSD', '16" 4K OLED', 'NVIDIA RTX 3070 Ti'),
  lap('ASUS VivoBook S 14 OLED M5406UA', 'AMD Ryzen AI 9 365', '24 GB', '1 TB SSD', '14" 2.8K OLED 120 Гц'),
  lap('ASUS VivoBook S 14 Flip TP3402', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '14" 2.8K OLED, поворотный'),
  lap('ASUS VivoBook 17 X1704VAP', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '17.3" FHD'),

  // ROG (gaming)
  lap('ASUS ROG Strix G15 G513', 'AMD Ryzen 7 4800H', '16 GB DDR4', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050'),
  lap('ASUS ROG Strix G15 G513QY', 'AMD Ryzen 9 5900HX', '16 GB DDR4', '1 TB SSD', '15.6" QHD 165 Гц', 'AMD Radeon RX 6800M'),
  lap('ASUS ROG Strix G16 G614', 'Intel Core i7-13650HX', '16 GB DDR5', '1 TB SSD', '16" QHD+ 240 Гц', 'NVIDIA RTX 4070'),
  lap('ASUS ROG Strix G17 G713', 'AMD Ryzen 7 6800H', '16 GB DDR5', '1 TB SSD', '17.3" QHD 240 Гц', 'NVIDIA RTX 3070 Ti'),
  lap('ASUS ROG Strix SCAR 16 G634', 'Intel Core i9-13980HX', '32 GB DDR5', '2 TB SSD', '16" QHD+ Mini LED 240 Гц', 'NVIDIA RTX 4090'),
  lap('ASUS ROG Strix SCAR 18 G834', 'Intel Core i9-14900HX', '32 GB DDR5', '2 TB SSD', '18" QHD+ Mini LED 240 Гц', 'NVIDIA RTX 4090'),
  lap('ASUS ROG Zephyrus G14 GA402', 'AMD Ryzen 9 7940HS', '32 GB DDR5', '1 TB SSD', '14" QHD+ 165 Гц', 'NVIDIA RTX 4060'),
  lap('ASUS ROG Zephyrus G14 GA403', 'AMD Ryzen AI 9 HX 370', '32 GB DDR5', '1 TB SSD', '14" 3K OLED 120 Гц', 'NVIDIA RTX 4070'),
  lap('ASUS ROG Zephyrus G16 GU603', 'Intel Core i9-13900H', '32 GB DDR5', '1 TB SSD', '16" QHD+ OLED 240 Гц', 'NVIDIA RTX 4070'),
  lap('ASUS ROG Zephyrus M16 GU603', 'Intel Core i9-12900H', '32 GB DDR5', '1 TB SSD', '16" QHD+ 165 Гц', 'NVIDIA RTX 3080 Ti'),
  lap('ASUS ROG Flow X13 GV301', 'AMD Ryzen 9 6900HS', '16 GB LPDDR5', '1 TB SSD', '13.4" QHD+ 120 Гц поворотный', 'NVIDIA RTX 3050 Ti'),
  lap('ASUS ROG Flow X16 GV601', 'Intel Core i9-12900H', '32 GB DDR5', '1 TB SSD', '16" QHD+ 165 Гц', 'NVIDIA RTX 3070 Ti'),
  lap('ASUS ROG Flow Z13 GZ301', 'Intel Core i9-13900H', '16 GB LPDDR5', '1 TB SSD', '13.4" QHD+ 165 Гц, планшетный', 'NVIDIA RTX 4060'),

  // TUF Gaming
  lap('ASUS TUF Gaming FX505DT', 'AMD Ryzen 5 3550H', '8 GB', '512 GB SSD', '15.6" FHD 120 Гц', 'NVIDIA GTX 1650'),
  lap('ASUS TUF Gaming F15 FX507ZE', 'Intel Core i7-12700H', '16 GB DDR5', '1 TB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050 Ti'),
  lap('ASUS TUF Gaming A15 FA506', 'AMD Ryzen 7 4800H', '8 GB', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA GTX 1660 Ti'),
  lap('ASUS TUF Gaming A15 FA507', 'AMD Ryzen 7 7735HS', '16 GB DDR5', '1 TB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4060'),
  lap('ASUS TUF Gaming A16 FA607', 'AMD Ryzen 9 8945HS', '16 GB DDR5', '1 TB SSD', '16" QHD+ 240 Гц', 'AMD Radeon RX 7700S'),
  lap('ASUS TUF Gaming F17 FX707', 'Intel Core i7-13700HX', '16 GB DDR5', '1 TB SSD', '17.3" FHD 144 Гц', 'NVIDIA RTX 4060'),

  // ExpertBook (бизнес)
  lap('ASUS ExpertBook B1 B1500', 'Intel Core i5-1135G7', '8 GB', '512 GB SSD', '15.6" FHD'),
  lap('ASUS ExpertBook B9 B9450', 'Intel Core i7-10510U', '16 GB', '1 TB SSD', '14" FHD', undefined, 'Лёгкий бизнес (880 г)'),
  lap('ASUS ExpertBook B5 B5402', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" FHD'),

  // ASUS старая классика (Eee PC уже есть в основном файле, добавлю ещё)
  lap('ASUS X555LD', 'Intel Core i3-4030U', '4 GB', '500 GB HDD', '15.6" HD', 'NVIDIA 820M', '2014 год, бюджетный'),
  lap('ASUS X550CC', 'Intel Core i5-3337U', '4 GB', '500 GB HDD', '15.6" HD', 'NVIDIA GT 720M'),
  lap('ASUS X550J', 'Intel Core i7-4720HQ', '8 GB', '1 TB HDD', '15.6" HD', 'NVIDIA GTX 950M', '2015 игровой'),
  lap('ASUS K56CB', 'Intel Core i5-3317U', '6 GB', '500 GB HDD', '15.6" HD', 'NVIDIA GT 740M'),
  lap('ASUS N551JK', 'Intel Core i7-4710HQ', '8 GB', '1 TB HDD', '15.6" FHD', 'NVIDIA GTX 850M'),

  // ============ Lenovo ============
  // ThinkPad
  lap('Lenovo ThinkPad X1 Carbon Gen 9', 'Intel Core i7-1165G7', '16 GB', '512 GB SSD', '14" WQHD'),
  lap('Lenovo ThinkPad X1 Carbon Gen 10', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" 2.2K'),
  lap('Lenovo ThinkPad X1 Carbon Gen 11', 'Intel Core i7-1355U', '16 GB', '1 TB SSD', '14" 2.8K OLED'),
  lap('Lenovo ThinkPad X1 Yoga Gen 7', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" WUXGA 2-в-1'),
  lap('Lenovo ThinkPad X1 Nano Gen 3', 'Intel Core i7-1370P', '16 GB', '1 TB SSD', '13" 2K', undefined, 'Сверхлёгкий ультрабук'),
  lap('Lenovo ThinkPad T14 Gen 4', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '14" WUXGA'),
  lap('Lenovo ThinkPad T16 Gen 2', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '16" WUXGA'),
  lap('Lenovo ThinkPad E14 Gen 5', 'AMD Ryzen 7 7730U', '16 GB', '512 GB SSD', '14" WUXGA'),
  lap('Lenovo ThinkPad P1 Gen 6', 'Intel Core i7-13800H', '32 GB', '1 TB SSD', '16" 3.2K OLED', 'NVIDIA RTX 4060'),
  lap('Lenovo ThinkPad P14s Gen 4', 'Intel Core i7-1370P', '32 GB', '1 TB SSD', '14" WUXGA', 'NVIDIA RTX A500'),

  // IdeaPad
  lap('Lenovo IdeaPad 3 15ITL6', 'Intel Core i3-1115G4', '8 GB', '256 GB SSD', '15.6" FHD'),
  lap('Lenovo IdeaPad 3 15IIL05', 'Intel Core i5-1035G1', '8 GB', '512 GB SSD', '15.6" FHD'),
  lap('Lenovo IdeaPad 5 14IAL7', 'Intel Core i5-1240P', '16 GB', '512 GB SSD', '14" WUXGA OLED'),
  lap('Lenovo IdeaPad 5 15ABA7', 'AMD Ryzen 7 5825U', '16 GB', '512 GB SSD', '15.6" FHD'),
  lap('Lenovo IdeaPad Slim 5 14IRH8', 'Intel Core i7-13620H', '16 GB', '1 TB SSD', '14" WUXGA OLED'),
  lap('Lenovo IdeaPad Slim 5 16IRH8', 'Intel Core i7-13700H', '16 GB', '512 GB SSD', '16" WUXGA OLED'),
  lap('Lenovo IdeaPad Pro 5 14IRH8', 'Intel Core i7-13700H', '32 GB', '1 TB SSD', '14" 2.8K OLED 120 Гц', 'NVIDIA RTX 3050'),

  // Yoga
  lap('Lenovo Yoga Slim 7 Pro 14IHU5', 'Intel Core i7-11370H', '16 GB', '1 TB SSD', '14" 2.2K'),
  lap('Lenovo Yoga 7 14IRL8', 'Intel Core i7-1355U', '16 GB', '1 TB SSD', '14" 2.8K OLED 2-в-1'),
  lap('Lenovo Yoga 9i 14IAP7', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" 2.8K OLED 2-в-1'),
  lap('Lenovo Yoga Book 9i 13IRU8', 'Intel Core i7-1355U', '16 GB', '1 TB SSD', '2× 13.3" OLED', undefined, '2 экрана'),
  lap('Lenovo Yoga Slim 7 14IMH9', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '14" 2.8K OLED 90 Гц'),

  // Legion (gaming)
  lap('Lenovo Legion 5 15ARH7H', 'AMD Ryzen 7 6800H', '16 GB DDR5', '1 TB SSD', '15.6" WQHD 165 Гц', 'NVIDIA RTX 3060'),
  lap('Lenovo Legion 5 Pro 16ARH7H', 'AMD Ryzen 7 6800H', '16 GB DDR5', '1 TB SSD', '16" WQXGA 165 Гц', 'NVIDIA RTX 3070 Ti'),
  lap('Lenovo Legion 5 16IRX9', 'Intel Core i7-14650HX', '16 GB DDR5', '1 TB SSD', '16" WQXGA 240 Гц', 'NVIDIA RTX 4070'),
  lap('Lenovo Legion 7 16IAX7', 'Intel Core i9-12900HX', '32 GB DDR5', '1 TB SSD', '16" WQXGA 165 Гц', 'NVIDIA RTX 3080 Ti'),
  lap('Lenovo Legion Pro 7 16IRX9H', 'Intel Core i9-14900HX', '32 GB DDR5', '2 TB SSD', '16" WQXGA 240 Гц', 'NVIDIA RTX 4090'),
  lap('Lenovo Legion Slim 5 16IRH8', 'Intel Core i7-13700H', '16 GB DDR5', '1 TB SSD', '16" WQXGA 165 Гц', 'NVIDIA RTX 4060'),
  lap('Lenovo Legion Slim 7 16IRH8', 'Intel Core i9-13900H', '32 GB DDR5', '1 TB SSD', '16" WQXGA 240 Гц', 'NVIDIA RTX 4070'),
  lap('Lenovo LOQ 15IRH8', 'Intel Core i5-13420H', '16 GB DDR5', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050'),
  lap('Lenovo LOQ 15IRX9', 'Intel Core i7-13650HX', '16 GB DDR5', '1 TB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4060'),

  // ============ HP ============
  // Pavilion / Envy / Spectre / Omen / Victus
  lap('HP Pavilion 14-dv2000', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '14" FHD'),
  lap('HP Pavilion 15-eg3000', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '15.6" FHD'),
  lap('HP Pavilion Plus 14-eh1000', 'Intel Core i7-13700H', '16 GB', '1 TB SSD', '14" 2.8K OLED 90 Гц'),
  lap('HP Envy 13-ba1000', 'Intel Core i7-1165G7', '16 GB', '512 GB SSD', '13.3" FHD'),
  lap('HP Envy 14-eb1000', 'Intel Core i5-1240P', '16 GB', '1 TB SSD', '14" 2.2K'),
  lap('HP Envy 16-h1000', 'Intel Core i7-13700H', '16 GB DDR5', '1 TB SSD', '16" 2.8K OLED 120 Гц', 'NVIDIA RTX 4060'),
  lap('HP Spectre x360 14-ef0000', 'Intel Core i7-1255U', '16 GB', '1 TB SSD', '13.5" 3K2K OLED 2-в-1'),
  lap('HP Spectre x360 16-aa0000', 'Intel Core i7-1360P', '16 GB', '1 TB SSD', '16" 3K+ OLED 2-в-1'),
  lap('HP Omen 16-wd0000', 'Intel Core i7-13700HX', '16 GB DDR5', '1 TB SSD', '16.1" QHD 240 Гц', 'NVIDIA RTX 4070'),
  lap('HP Omen 17-cm2000', 'Intel Core i9-13900HX', '32 GB DDR5', '2 TB SSD', '17.3" QHD 240 Гц', 'NVIDIA RTX 4080'),
  lap('HP Victus 15-fa1000', 'Intel Core i5-13420H', '16 GB DDR4', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050'),
  lap('HP Victus 16-r0000', 'Intel Core i7-13700H', '16 GB DDR5', '1 TB SSD', '16.1" QHD 165 Гц', 'NVIDIA RTX 4060'),

  // EliteBook / ProBook / ZBook
  lap('HP EliteBook 840 G10', 'Intel Core i7-1365U', '16 GB', '512 GB SSD', '14" WUXGA'),
  lap('HP EliteBook 860 G10', 'Intel Core i7-1365U', '16 GB', '1 TB SSD', '16" WUXGA'),
  lap('HP EliteBook X G1a', 'AMD Ryzen AI 9 HX 375', '32 GB', '1 TB SSD', '14" 2.8K OLED'),
  lap('HP ProBook 450 G10', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '15.6" FHD'),
  lap('HP ProBook 460 G11', 'Intel Core Ultra 7 155U', '16 GB', '512 GB SSD', '16" WUXGA'),
  lap('HP ZBook Studio G10', 'Intel Core i9-13900H', '32 GB', '1 TB SSD', '16" 3K OLED 120 Гц', 'NVIDIA RTX 4070'),

  // ============ Acer ============
  lap('Acer Aspire 3 A315-58', 'Intel Core i3-1115G4', '8 GB', '256 GB SSD', '15.6" FHD'),
  lap('Acer Aspire 5 A515-57', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '15.6" FHD'),
  lap('Acer Aspire 5 A515-58P', 'Intel Core i7-1355U', '16 GB', '1 TB SSD', '15.6" FHD'),
  lap('Acer Aspire 7 A715-76G', 'Intel Core i5-12450H', '16 GB', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050'),
  lap('Acer Swift 3 SF314-512', 'Intel Core i5-1240P', '8 GB', '512 GB SSD', '14" 2.5K'),
  lap('Acer Swift 5 SF514-56T', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '14" 2.5K сенсорный'),
  lap('Acer Swift Edge SFE16-43', 'AMD Ryzen 7 7735U', '16 GB', '1 TB SSD', '16" 3.2K OLED', undefined, '<1.2 кг'),
  lap('Acer Swift Go 14 SFG14-71', 'Intel Core i7-13700H', '16 GB', '1 TB SSD', '14" 2.8K OLED'),
  lap('Acer Predator Helios 16 PH16-71', 'Intel Core i7-13700HX', '16 GB DDR5', '1 TB SSD', '16" WQXGA 240 Гц', 'NVIDIA RTX 4070'),
  lap('Acer Predator Helios Neo 16 PHN16-71', 'Intel Core i7-13700HX', '16 GB DDR5', '1 TB SSD', '16" WQXGA 165 Гц', 'NVIDIA RTX 4060'),
  lap('Acer Predator Triton 14 PT14-51', 'Intel Core i7-13700H', '32 GB DDR5', '1 TB SSD', '14" 2.8K 250 Гц', 'NVIDIA RTX 4070'),
  lap('Acer Nitro 5 AN515-57', 'Intel Core i5-11400H', '8 GB', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 3050'),
  lap('Acer Nitro 16 AN16-41', 'AMD Ryzen 7 7840HS', '16 GB DDR5', '1 TB SSD', '16" WQXGA 240 Гц', 'NVIDIA RTX 4070'),
  lap('Acer Nitro V 15 ANV15-51', 'Intel Core i5-13420H', '16 GB DDR5', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4050'),

  // ============ Dell ============
  lap('Dell XPS 13 9320', 'Intel Core i7-1260P', '16 GB', '512 GB SSD', '13.4" FHD+'),
  lap('Dell XPS 13 Plus 9320', 'Intel Core i7-1260P', '16 GB', '1 TB SSD', '13.4" 3.5K OLED'),
  lap('Dell XPS 13 9340', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '13.4" 2.8K OLED'),
  lap('Dell XPS 14 9440', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '14.5" 3.2K OLED', 'NVIDIA RTX 4050'),
  lap('Dell XPS 15 9530', 'Intel Core i7-13700H', '16 GB', '1 TB SSD', '15.6" 3.5K OLED', 'NVIDIA RTX 4060'),
  lap('Dell XPS 16 9640', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '16.3" 4K+ OLED', 'NVIDIA RTX 4070'),
  lap('Dell XPS 17 9730', 'Intel Core i7-13700H', '16 GB', '1 TB SSD', '17" UHD+', 'NVIDIA RTX 4060'),
  lap('Dell Inspiron 14 5440', 'Intel Core i7-1355U', '16 GB', '512 GB SSD', '14" FHD+'),
  lap('Dell Inspiron 15 3520', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '15.6" FHD'),
  lap('Dell Inspiron 16 7640', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '16" FHD+'),
  lap('Dell Latitude 7440', 'Intel Core i7-1365U', '16 GB', '512 GB SSD', '14" FHD+'),
  lap('Dell Latitude 9450', 'Intel Core Ultra 7 165U', '16 GB', '1 TB SSD', '14" 2K сенсорный'),
  lap('Dell Alienware m16 R1', 'Intel Core i7-13700HX', '16 GB DDR5', '1 TB SSD', '16" QHD+ 240 Гц', 'NVIDIA RTX 4070'),
  lap('Dell Alienware m18 R1', 'Intel Core i9-13900HX', '32 GB DDR5', '2 TB SSD', '18" QHD+ 165 Гц', 'NVIDIA RTX 4080'),
  lap('Dell Alienware x14 R2', 'Intel Core i7-13620H', '16 GB DDR5', '1 TB SSD', '14" QHD+ 165 Гц', 'NVIDIA RTX 4060'),

  // ============ MSI ============
  lap('MSI Modern 14 C12M', 'Intel Core i5-1235U', '16 GB', '512 GB SSD', '14" FHD'),
  lap('MSI Modern 15 B12M', 'Intel Core i5-1235U', '8 GB', '512 GB SSD', '15.6" FHD'),
  lap('MSI Prestige 14 Evo B13M', 'Intel Core i7-13700H', '16 GB', '1 TB SSD', '14" QHD+'),
  lap('MSI Prestige 16 AI Evo B1M', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '16" QHD+ OLED 120 Гц'),
  lap('MSI Stealth 14 AI Studio A1V', 'Intel Core Ultra 7 155H', '16 GB DDR5', '1 TB SSD', '14" 3K OLED', 'NVIDIA RTX 4070'),
  lap('MSI Stealth 16 AI Studio A1V', 'Intel Core Ultra 9 185H', '32 GB DDR5', '1 TB SSD', '16" 4K OLED', 'NVIDIA RTX 4080'),
  lap('MSI Cyborg 15 A12V', 'Intel Core i7-12650H', '16 GB DDR5', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4050'),
  lap('MSI Cyborg 15 A13V', 'Intel Core i7-13620H', '16 GB DDR5', '512 GB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4060'),
  lap('MSI Sword 15 A12V', 'Intel Core i7-12650H', '16 GB', '1 TB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4060'),
  lap('MSI Sword 16 HX B14V', 'Intel Core i7-14700HX', '16 GB DDR5', '1 TB SSD', '16" QHD+ 240 Гц', 'NVIDIA RTX 4070'),
  lap('MSI Katana 15 B13V', 'Intel Core i7-13620H', '16 GB DDR5', '1 TB SSD', '15.6" FHD 144 Гц', 'NVIDIA RTX 4060'),
  lap('MSI Vector GP66 12UH', 'Intel Core i9-12900H', '32 GB DDR5', '1 TB SSD', '15.6" QHD 240 Гц', 'NVIDIA RTX 3080 Ti'),
  lap('MSI Raider GE76 12UH', 'Intel Core i9-12900HX', '32 GB DDR5', '2 TB SSD', '17.3" 4K 120 Гц', 'NVIDIA RTX 3080 Ti'),
  lap('MSI Raider GE78 HX 14V', 'Intel Core i9-14900HX', '32 GB DDR5', '2 TB SSD', '17" QHD+ 240 Гц Mini LED', 'NVIDIA RTX 4090'),
  lap('MSI Titan 18 HX A14V', 'Intel Core i9-14900HX', '64 GB DDR5', '2 TB SSD', '18" 4K Mini LED 120 Гц', 'NVIDIA RTX 4090'),

  // ============ Samsung Galaxy Book ============
  lap('Samsung Galaxy Book2 NP750', 'Intel Core i7-1255U', '16 GB', '512 GB SSD', '15.6" FHD'),
  lap('Samsung Galaxy Book3 Pro 360', 'Intel Core i7-1360P', '16 GB', '512 GB SSD', '16" 3K AMOLED 2-в-1'),
  lap('Samsung Galaxy Book4 Pro', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '14" 2.8K AMOLED'),
  lap('Samsung Galaxy Book4 Pro 360', 'Intel Core Ultra 7 155H', '16 GB', '1 TB SSD', '16" 3K AMOLED 2-в-1'),
  lap('Samsung Galaxy Book4 Ultra', 'Intel Core Ultra 9 185H', '32 GB', '1 TB SSD', '16" 3K AMOLED 120 Гц', 'NVIDIA RTX 4070'),

  // ============ Huawei MateBook ============
  lap('Huawei MateBook D14', 'Intel Core i5-1240P', '16 GB', '512 GB SSD', '14" 2K'),
  lap('Huawei MateBook D16', 'Intel Core i5-1240P', '16 GB', '512 GB SSD', '16" FHD'),
  lap('Huawei MateBook 14', 'Intel Core i7-1360P', '16 GB', '1 TB SSD', '14" 2.1K'),
  lap('Huawei MateBook X Pro 2024', 'Intel Core Ultra 9 185H', '32 GB', '2 TB SSD', '14.2" 3.1K OLED'),

  // ============ Старые iPhone ============
  phone('iPhone SE (2016)', 'Apple A9', '2 GB', '32 GB', '4" Retina', '12 МП', 'Touch ID, 4" корпус'),
  phone('iPhone 6S 32GB', 'Apple A9', '2 GB', '32 GB', '4.7" Retina HD', '12 МП'),
  phone('iPhone 7 128GB', 'Apple A10 Fusion', '2 GB', '128 GB', '4.7" Retina HD', '12 МП', 'Без аудиоразъёма'),
  phone('iPhone 7 Plus 128GB', 'Apple A10 Fusion', '3 GB', '128 GB', '5.5" Retina HD', '12 + 12 МП'),
  phone('iPhone 8 64GB', 'Apple A11 Bionic', '2 GB', '64 GB', '4.7" Retina HD', '12 МП', 'Беспроводная зарядка Qi'),
  phone('iPhone 8 Plus 64GB', 'Apple A11 Bionic', '3 GB', '64 GB', '5.5" Retina HD', '12 + 12 МП'),
  phone('iPhone X 64GB', 'Apple A11 Bionic', '3 GB', '64 GB', '5.8" Super Retina OLED', '12 + 12 МП', 'Первый с Face ID'),
  phone('iPhone XS 64GB', 'Apple A12 Bionic', '4 GB', '64 GB', '5.8" Super Retina OLED', '12 + 12 МП'),
  phone('iPhone XS Max 256GB', 'Apple A12 Bionic', '4 GB', '256 GB', '6.5" Super Retina OLED', '12 + 12 МП'),
  phone('iPhone XR 64GB', 'Apple A12 Bionic', '3 GB', '64 GB', '6.1" Liquid Retina HD', '12 МП'),
  phone('iPhone SE (2020) 64GB', 'Apple A13 Bionic', '3 GB', '64 GB', '4.7" Retina HD', '12 МП', 'Touch ID, корпус iPhone 8'),

  // ============ Старые Samsung Galaxy ============
  phone('Samsung Galaxy S8 64GB', 'Exynos 8895', '4 GB', '64 GB', '5.8" QHD+ Super AMOLED', '12 МП'),
  phone('Samsung Galaxy S9 64GB', 'Exynos 9810', '4 GB', '64 GB', '5.8" QHD+ Super AMOLED', '12 МП'),
  phone('Samsung Galaxy S9+ 128GB', 'Exynos 9810', '6 GB', '128 GB', '6.2" QHD+ Super AMOLED', '12 + 12 МП'),
  phone('Samsung Galaxy S10 128GB', 'Exynos 9820', '8 GB', '128 GB', '6.1" QHD+ Dynamic AMOLED', '12 + 12 + 16 МП'),
  phone('Samsung Galaxy S10+ 128GB', 'Exynos 9820', '8 GB', '128 GB', '6.4" QHD+ Dynamic AMOLED', '12 + 12 + 16 МП'),
  phone('Samsung Galaxy Note 9 128GB', 'Exynos 9810', '6 GB', '128 GB', '6.4" QHD+ Super AMOLED', '12 + 12 МП', 'S Pen'),
  phone('Samsung Galaxy Note 10 256GB', 'Exynos 9825', '8 GB', '256 GB', '6.3" FHD+ Dynamic AMOLED', '12 + 12 + 16 МП', 'S Pen'),
  phone('Samsung Galaxy Note 20 Ultra 256GB', 'Exynos 990', '12 GB', '256 GB', '6.9" QHD+ Dynamic AMOLED 120 Гц', '108 + 12 + 12 МП', 'S Pen, 5G'),
  phone('Samsung Galaxy S20 FE 128GB', 'Snapdragon 865 / Exynos 990', '6 GB', '128 GB', '6.5" FHD+ Super AMOLED 120 Гц', '12 + 12 + 8 МП'),
  phone('Samsung Galaxy A50 128GB', 'Exynos 9610', '4 GB', '128 GB', '6.4" FHD+ Super AMOLED', '25 + 8 + 5 МП'),
  phone('Samsung Galaxy A52 128GB', 'Snapdragon 720G', '6 GB', '128 GB', '6.5" FHD+ Super AMOLED 90 Гц', '64 + 12 + 5 + 5 МП'),

  // ============ Бытовая техника — дополнительно ============
  { title: 'Atlant ХМ 4424 N-009', category: 'appliance_large', description: 'Холодильник No Frost',
    specs: { Тип: 'двухкамерный', Объём: '305 л', 'No Frost': 'есть', Высота: '197 см' } },
  { title: 'Indesit ITS 4180 W', category: 'appliance_large', description: 'Холодильник комбинированный',
    specs: { Тип: 'двухкамерный', Объём: '298 л', Высота: '185 см' } },
  { title: 'Hotpoint-Ariston HF 4180 W', category: 'appliance_large', description: 'Холодильник No Frost',
    specs: { Тип: 'двухкамерный', Объём: '300 л', 'No Frost': 'есть' } },
  { title: 'LG GA-B509SLSM', category: 'appliance_large', description: 'Холодильник с инвертором',
    specs: { Тип: 'двухкамерный', Объём: '419 л', 'Инверторный компрессор': 'есть' } },
  { title: 'Samsung RB37A5290SA', category: 'appliance_large', description: 'Холодильник 2 м',
    specs: { Тип: 'двухкамерный', Объём: '367 л', 'No Frost': 'есть' } },
  { title: 'Bosch KGE39ALCA', category: 'appliance_large', description: 'Холодильник Premium',
    specs: { Тип: 'двухкамерный', Объём: '348 л', 'Перевешиваемые двери': 'есть' } },
  { title: 'LG F2J5HS6W (стиральная машина)', category: 'appliance_large', description: '6 кг, инвертор',
    specs: { Тип: 'фронтальная', Загрузка: '6 кг', Отжим: '1200 об/мин', Инвертор: 'есть' } },
  { title: 'Samsung WW70J5210JW', category: 'appliance_large', description: '7 кг, EcoBubble',
    specs: { Тип: 'фронтальная', Загрузка: '7 кг', Отжим: '1200 об/мин', EcoBubble: 'есть' } },
  { title: 'Indesit IWUC 4105', category: 'appliance_large', description: 'Узкая 33 см, 4 кг',
    specs: { Тип: 'фронтальная узкая', Загрузка: '4 кг', Глубина: '33 см' } },
  { title: 'Beko WRE 5512 BWW', category: 'appliance_large', description: '5 кг, 1000 об/мин',
    specs: { Тип: 'фронтальная узкая', Загрузка: '5 кг', Отжим: '1000 об/мин' } },

  // ============ Кофемашины — дополнительно ============
  { title: 'Saeco Xelsis Suprema', category: 'appliance_kitchen', description: 'Автомат, 22 рецепта',
    specs: { Тип: 'автоматическая зерновая', 'LatteCrema': 'есть', 'Сенсорный экран': '5"' } },
  { title: 'JURA ENA 8', category: 'appliance_kitchen', description: 'Швейцарская автоматическая',
    specs: { Тип: 'автоматическая зерновая', Бренд: 'Швейцария', Объём: '1.1 л' } },
  { title: 'Krups EA816031 Espresseria', category: 'appliance_kitchen', description: 'Зерновая автоматическая',
    specs: { Тип: 'автоматическая зерновая' } },
  { title: 'Melitta Caffeo Solo', category: 'appliance_kitchen', description: 'Компактная зерновая',
    specs: { Тип: 'автоматическая зерновая', Ширина: '20 см' } },
  { title: 'Polaris PCM 2010 (рожковая)', category: 'appliance_kitchen', description: '15 бар, для дома',
    specs: { Тип: 'рожковая', Давление: '15 бар' } },
  { title: 'Redmond RCM-CBM1514 (капсульная)', category: 'appliance_kitchen', description: 'Капсулы Nespresso',
    specs: { Тип: 'капсульная', Совместимость: 'Nespresso' } },

  // ============ Дополнительные iPad / Apple ============
  { title: 'iPad Pro 12.9" 4-го поколения (2020) 256GB', category: 'tablet', description: 'A12Z Bionic, LiDAR',
    specs: { Чип: 'Apple A12Z Bionic', Хранилище: '256 GB', Экран: '12.9" Liquid Retina ProMotion 120 Гц' } },
  { title: 'iPad Pro 12.9" M1 256GB', category: 'tablet', description: 'Apple M1, mini-LED',
    specs: { Чип: 'Apple M1', Хранилище: '256 GB', Экран: '12.9" Liquid Retina XDR mini-LED' } },
  { title: 'iPad Pro 12.9" M2 256GB', category: 'tablet', description: 'Apple M2, Pencil Hover',
    specs: { Чип: 'Apple M2', Хранилище: '256 GB', Экран: '12.9" Liquid Retina XDR mini-LED' } },
];
