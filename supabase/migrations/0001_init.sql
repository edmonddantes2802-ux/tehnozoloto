-- Техно-Золото: initial schema
create extension if not exists pgcrypto;

-- ===== gold_prices =====
create table if not exists gold_prices (
  id serial primary key,
  karat integer not null check (karat in (375, 585, 750, 999)),
  price_per_gram numeric not null check (price_per_gram >= 0),
  updated_at timestamptz not null default now()
);

-- ===== leads =====
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  category text not null check (category in ('gold', 'tech')),
  details jsonb,
  estimated_value numeric,
  status text not null default 'new'
    check (status in ('new', 'processing', 'completed', 'rejected')),
  is_duplicate boolean not null default false,
  bitrix_lead_id text,
  user_id uuid references auth.users(id) on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text
);
create index if not exists idx_leads_phone on leads(phone);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_leads_status on leads(status);

-- ===== products =====
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null check (price >= 0),
  old_price numeric,
  category text,
  images text[] not null default '{}',
  condition text check (condition in ('new', 'excellent', 'good', 'fair')),
  is_sold boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_sold on products(is_sold);

-- ===== promotions =====
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  code text unique not null,
  discount_percent integer not null check (discount_percent between 0 and 100),
  active_until date
);

-- ===== RLS =====
alter table leads enable row level security;
alter table products enable row level security;
alter table gold_prices enable row level security;
alter table promotions enable row level security;

drop policy if exists "Anyone can insert leads" on leads;
create policy "Anyone can insert leads" on leads
  for insert with check (true);

drop policy if exists "Users view own leads" on leads;
create policy "Users view own leads" on leads
  for select using (auth.uid() = user_id);

drop policy if exists "Public reads products" on products;
create policy "Public reads products" on products
  for select using (is_sold = false);

drop policy if exists "Public reads gold prices" on gold_prices;
create policy "Public reads gold prices" on gold_prices
  for select using (true);

drop policy if exists "Public reads promotions" on promotions;
create policy "Public reads promotions" on promotions
  for select using (true);

-- ===== seed =====
insert into gold_prices (karat, price_per_gram) values
  (375, 2200),
  (585, 3500),
  (750, 4500),
  (999, 6100)
on conflict do nothing;

insert into promotions (title, code, discount_percent, active_until)
values ('Скидка 10% в честь открытия', 'OPEN10', 10, (now() + interval '30 days')::date)
on conflict (code) do nothing;

insert into products (title, description, price, old_price, category, condition)
values
  ('iPhone 14 Pro 256GB', 'Отличное состояние, коробка, комплект', 62000, 85000, 'smartphone', 'excellent'),
  ('MacBook Air M2', 'В коробке, 10 циклов батареи', 78000, 95000, 'laptop', 'excellent'),
  ('Цепь золотая 585, 8г', 'Плетение Бисмарк', 24500, null, 'gold', 'new'),
  ('PlayStation 5', '2 геймпада, 4 игры в комплекте', 39000, 45000, 'other', 'good'),
  ('Кольцо золотое 750, 3г', 'С бриллиантом 0.1 карат', 28800, null, 'gold', 'excellent'),
  ('Samsung Galaxy S23', '128GB, Graphite, б/у 3 мес', 41000, 55000, 'smartphone', 'good')
on conflict do nothing;
