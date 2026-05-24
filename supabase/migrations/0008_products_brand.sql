-- 0008_products_brand.sql
-- Добавляет колонку brand (производитель) в products.
-- Используется в cascading selector админ-формы:
-- Категория → Бренд (top-10 + спойлер) → Модель (текстом).

alter table products
  add column if not exists brand text;

create index if not exists idx_products_brand on products(brand);
