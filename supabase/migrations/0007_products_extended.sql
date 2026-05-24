-- 0007_products_extended.sql
-- Расширение таблицы products для админ-выгрузки:
--   is_published — черновики не показываются в каталоге и витрине
--   specs        — свободный JSON с характеристиками (чип, RAM, экран и т.п.)
--   battery_health — состояние аккумулятора в процентах (0–100), nullable

alter table products
  add column if not exists is_published boolean not null default true,
  add column if not exists specs jsonb,
  add column if not exists battery_health smallint
    check (battery_health is null or (battery_health between 0 and 100));

create index if not exists idx_products_published on products(is_published);

-- Уже опубликованные товары останутся published=true благодаря default.
-- Тестовые товары и черновики можно создавать с is_published = false.

-- Обновлённая RLS-политика для публичного чтения: только опубликованные
-- и не проданные.
drop policy if exists "Public reads products" on products;
create policy "Public reads products" on products
  for select using (is_sold = false and is_published = true);
