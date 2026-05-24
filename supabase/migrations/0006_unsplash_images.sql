-- 0006_unsplash_images.sql
-- Возвращает Unsplash-фото вместо placehold.co для смартфонов / ноутбуков /
-- инструмента. Ювелирка ('gold') и тестовые товары не трогаются.
-- UPDATE по title — UUID товаров не меняются.

update products set images = ARRAY['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80']::text[] where title = 'Philips Xenium E111' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi 9C NFC' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Realme Note 60x 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi 13C 4/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi 10A 6/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi POCO C75 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Realme 9i 4/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Tecno Spark 20 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi 14C 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'POCO C65 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Realme 9 Pro 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80']::text[] where title = 'Sony Xperia 5 II 8/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'OPPO A5x 4/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Realme GT Master Edition 6/128' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi Note 12S 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80']::text[] where title = 'Makita GA7020 (УШМ)' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80']::text[] where title = 'OnePlus Nord 2 5G 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80']::text[] where title = 'Oppo Reno 12F 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80']::text[] where title = 'iPhone 11 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80']::text[] where title = 'Sony Xperia 1 II' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80']::text[] where title = 'ASUS ROG Phone 3' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80']::text[] where title = 'Honor 400 Lite 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80']::text[] where title = 'Samsung Galaxy S21 5G 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80']::text[] where title = 'Samsung Galaxy A56 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80']::text[] where title = 'Samsung Galaxy S21+ 5G 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi Redmi Note 13 Pro+ 512GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1662219708489-ebd83c91f24e?w=800&q=80']::text[] where title = 'Xiaomi 14 12/512' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80']::text[] where title = 'iPhone 14 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1678911820864-e5cfd7c6c8df?w=800&q=80']::text[] where title = 'Samsung Galaxy S22 Ultra 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80']::text[] where title = 'iPhone 14 Pro 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80']::text[] where title = 'Samsung Galaxy S25 FE 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80']::text[] where title = 'iPhone 13 Pro Max 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80']::text[] where title = 'Samsung Galaxy S24 8/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80']::text[] where title = 'Google Pixel 9 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80']::text[] where title = 'iPhone 13 Pro Max 1TB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80']::text[] where title = 'iPhone 14 Plus 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1695048133115-f5d6c721f8f1?w=800&q=80']::text[] where title = 'HONOR Magic V2 16/512' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80']::text[] where title = 'iPhone 15 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80']::text[] where title = 'iPhone 14 Pro Max 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80']::text[] where title = 'iPhone 16 128GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80']::text[] where title = 'iPhone 15 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80']::text[] where title = 'MacBook Air 13" M1 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80']::text[] where title = 'iPhone 16E 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80']::text[] where title = 'Samsung Galaxy S25 12/256' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80']::text[] where title = 'iPhone 15 Pro Max 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80']::text[] where title = 'iPhone 17 Pro 256GB' and category != 'test';
update products set images = ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80']::text[] where title = 'iPhone 17 Pro 256GB eSIM' and category != 'test';

