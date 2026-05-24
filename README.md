# Техно-Золото — комиссионный магазин

Fintech-лендинг с калькулятором оценки золота и техники, захватом лидов,
каталогом товаров, личным кабинетом (OTP) и админ-панелью.

## Стек

- **Next.js 14** (App Router) + TypeScript (strict)
- **Tailwind CSS** + кастомная дизайн-система (Navy / Gold)
- **Framer Motion** — анимации, counter-эффект в калькуляторе
- **Supabase** — Postgres + Auth + Edge Functions + Realtime
- **react-hook-form + Zod** — валидация форм
- **Zustand** — state калькулятора
- **Bitrix24 REST** — синхронизация лидов в CRM

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать .env
cp .env.example .env.local
# Заполнить NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Dev-сервер
npm run dev
# → http://localhost:3000
```

Лендинг работает **без Supabase** — сервис автоматически фоллбэчит на mock-цены
золота и mock-каталог. Для реальной работы заявок настройте БД ниже.

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В SQL Editor выполните миграцию: `supabase/migrations/0001_init.sql`.
3. В **Authentication → Providers** включите **Phone**
   (для OTP нужен SMS-провайдер: Twilio / MessageBird).
4. Скопируйте Project URL и anon key в `.env.local`.

## Интеграция с Bitrix24

Edge Function `sync-bitrix` триггерится Database Webhook-ом на `INSERT INTO leads`.

```bash
# Установить Supabase CLI и задеплоить функцию
supabase login
supabase link --project-ref <your-ref>
supabase functions deploy sync-bitrix

# Секреты
supabase secrets set BITRIX24_WEBHOOK_URL=https://b24-domain.bitrix24.ru/rest/1/TOKEN/
supabase secrets set BITRIX24_ASSIGNED_BY_ID=1
```

Затем в Supabase Dashboard → **Database → Webhooks** создайте hook:
- Table: `leads`
- Events: `Insert`
- Type: `Supabase Edge Functions`
- Function: `sync-bitrix`

## Структура

```
app/
  (public)/           # Публичные страницы: landing, catalog, profile
  (auth)/login/       # Вход по OTP
  admin/              # Админ-панель (цены золота + заявки)
  api/leads/          # POST endpoint для формы лидов (валидация + rate-limit)
  api/bitrix/         # Ручной прокси для отладки Bitrix
components/
  layout/             # Header, Footer, PromoBanner
  shared/             # Button, Input, Card, AnimatedCounter
  sections/           # Hero, Problems, Solution, HowItWorks, Showcase, Reviews, FAQ
  forms/              # Calculator, LeadForm, PhoneOTPForm
hooks/                # useAuth, useGoldPrices (с realtime)
store/                # calculatorStore (Zustand)
lib/                  # supabase/{client,server}.ts, utils, validators
services/             # price-calculator, bitrix-service, leads-service
types/                # database.ts, index.ts
supabase/
  migrations/         # SQL-схема БД
  functions/sync-bitrix/  # Deno Edge Function
```

## Бизнес-логика

**Золото:**
```
ЦЕНА = ВЕС × ЦЕНА_ЗА_ГРАММ × (1 − СКИДКА_АКЦИИ)
```

**Техника:**
```
ЦЕНА = БАЗОВАЯ_ЦЕНА_МОДЕЛИ × КОЭФФ_СОСТОЯНИЯ
КОЭФФ: excellent=0.85, good=0.7, defective=0.4
```

Функции чистые, живут в [`services/price-calculator.ts`](services/price-calculator.ts).

## Команды

```bash
npm run dev        # dev-сервер
npm run build      # продакшн-сборка
npm run start      # запуск production
npm run lint       # ESLint
npm run typecheck  # строгая проверка типов
```

## Что НЕ сделано (сознательно)

- unit-тесты (стек готов к vitest)
- реальные картинки товаров — используются emoji-заглушки
- ролевая модель админа сверх Supabase RLS
- интеграция с WhatsApp Business API (только `wa.me` ссылка)
