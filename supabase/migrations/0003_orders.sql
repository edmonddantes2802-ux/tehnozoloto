-- Техно-Золото: заказы из корзины + интеграция с ЮKassa
create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_method text not null
    check (delivery_method in ('pickup', 'courier_msk', 'regions')),
  items jsonb not null default '[]'::jsonb,
  total numeric not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded', 'shipped', 'completed')),
  payment_id text,
  paid_at timestamptz,
  notes text
);

create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_phone on orders(customer_phone);
create index if not exists idx_orders_payment on orders(payment_id);

alter table orders enable row level security;

-- Создание заказа возможно анонимно (гость без логина). Доступ к чтению/правке —
-- только сервисной ролью (admin) через серверный API. На прод-уровне политику
-- можно сузить, привязав к auth.uid(), если корзина потребует логина.
drop policy if exists "Anyone can insert orders" on orders;
create policy "Anyone can insert orders" on orders
  for insert with check (true);
