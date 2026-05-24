-- 0009_products_complectation_battery.sql
-- 1) Колонка complectation: массив строк (что входит в комплект).
-- 2) battery_health превращаем из smallint(0..100) в text — теперь можно писать
--    «АКБ 85%», «500 циклов» или «10000 mAh из 19000 mAh».

-- Снимаем check-ограничение прежнего поля battery_health
alter table products
  drop constraint if exists products_battery_health_check;

-- Меняем тип. PostgreSQL умеет smallint → text через явное приведение.
alter table products
  alter column battery_health type text using (
    case
      when battery_health is null then null
      else battery_health::text
    end
  );

-- Новая колонка с комплектностью (список пунктов).
alter table products
  add column if not exists complectation text[] not null default '{}';
