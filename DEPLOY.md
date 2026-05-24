# Деплой «Техно-Золото» на Beget VPS + Coolify

Полная пошаговая инструкция: от загрузки кода до боевого домена с HTTPS.
Предполагается, что VPS на Beget куплен, Coolify уже установлен и открывается
по адресу вида `http://<IP-сервера>:8000`.

---

## 1. Залить код в GitHub

Локально из папки проекта:

```bash
git init
git add .
git commit -m "init: tehno-zoloto"

# Создайте приватный репозиторий tehno-zoloto на GitHub, затем:
git remote add origin git@github.com:<your-username>/tehno-zoloto.git
git branch -M main
git push -u origin main
```

В `.gitignore` `.env.local` и `node_modules` уже исключены — ключи в репозиторий
не утекут.

---

## 2. Завести прод-проект Supabase

1. Откройте https://supabase.com → **New project**. Регион — Frankfurt (минимальная
   задержка из РФ) или Stockholm.
2. Дождитесь поднятия Postgres (~2 минуты).
3. В **SQL Editor** выполните по очереди:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_reservations.sql`
4. **Authentication → Providers → Phone** — включите. Для боевых SMS нужен
   платный SMS-провайдер (Twilio / MessageBird). Для теста можно временно
   включить **Email** провайдер с magic-link.
5. **Settings → API** — скопируйте на потом:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY — нужен только для Edge
     Functions / синка с Bitrix; на фронт не попадает)

---

## 3. Купить домен на Beget и направить на VPS

1. В панели Beget: **Домены и поддомены → Регистрация** — выбираете имя
   (например `tehno-zoloto.ru`).
2. После активации перейдите в **DNS** для этого домена и заведите запись:
   - Тип `A`, имя `@`, значение `<IP-вашего-VPS>`, TTL 300
   - Тип `A`, имя `www`, значение `<IP-вашего-VPS>`, TTL 300
3. Проверьте через 5–10 минут: `nslookup tehno-zoloto.ru 8.8.8.8` должен
   показать ваш IP. Coolify сам поднимет Let's Encrypt-сертификат.

---

## 4. Подключить GitHub к Coolify

1. Откройте Coolify → **Sources → + Add → GitHub App**.
2. Жмёте **Install GitHub App**, авторизуете на свою учётку GitHub,
   выбираете репозиторий `tehno-zoloto`.
3. Возвращаетесь в Coolify — Source появляется в списке.

Альтернатива (быстрее, но без авто-деплоя по push): **Sources → Public/Private
Repository → Deploy Key** — добавить SSH-ключ Coolify в GitHub Deploy keys.

---

## 5. Создать приложение в Coolify

1. **Projects → + Add → Project** → имя `tehno-zoloto`.
2. Внутри проекта **+ New Resource → Public/Private GitHub** → выбираете репо.
3. **Build Pack**: `Dockerfile`. Coolify сам подхватит `Dockerfile` в корне.
4. **Port Exposes**: `3000`.
5. **Domains**: `https://tehno-zoloto.ru, https://www.tehno-zoloto.ru` (через
   запятую). Coolify сам сходит за Let's Encrypt, как только DNS-запись A
   указывает на этот сервер.

---

## 6. Переменные окружения

В Coolify приложения → **Environment Variables**. Добавьте все ниже.
Колонка **Build Time?** отмечает, нужна ли переменная во время `npm run build`
(NEXT_PUBLIC_* зашиваются в клиентский бандл — их нужно знать **до** билда).

| Переменная | Значение | Build Time? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `https://tehno-zoloto.ru` | ✅ |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | `79680952288` | ✅ |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` или пусто | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (если нужен серверный admin-доступ) | ❌ |
| `BITRIX24_WEBHOOK_URL` | `https://<домен>.bitrix24.ru/rest/1/<token>/` | ❌ |
| `BITRIX24_ASSIGNED_BY_ID` | `1` | ❌ |

После сохранения — **Deploy**.

---

## 7. Допилить Supabase Auth

В Supabase **Authentication → URL Configuration**:

- **Site URL**: `https://tehno-zoloto.ru`
- **Redirect URLs**: `https://tehno-zoloto.ru/**`

Без этого SMS/OTP-флоу будет редиректить на localhost.

---

## 8. Проверка после первого деплоя

1. `https://tehno-zoloto.ru/` — лендинг, секция «О нас», калькулятор.
2. `https://tehno-zoloto.ru/catalog` — каталог из БД Supabase. Если пусто — таблица
   `products` ещё не наполнена; миграция `0001_init.sql` уже вставляет 6 примеров.
3. `https://tehno-zoloto.ru/login` — экран SMS-OTP. Введите номер →
   получите код → войдите.
4. `https://tehno-zoloto.ru/catalog` → нажмите «Забронировать» под товаром →
   попадёте в /profile с активной бронью на 24 часа.
5. `https://tehno-zoloto.ru/admin` — админка (просмотр заявок и цен).
   Без ролевой защиты доступна любому залогиненному; если нужна защита по роли —
   попросите её прикрутить отдельно.

---

## 9. Авто-деплой по push

В Coolify приложение → **General → Settings → Auto Deploy** = on.
После этого каждый `git push origin main` сам пересобирает образ и катит
без даунтайма (rolling).

---

## 10. Что мониторить в Coolify

- **Logs** во вкладке приложения — рантайм-логи Next.js.
- **Resources** — CPU/RAM/диск VPS. Если RAM ниже 400 МБ во время билда — у вас
  тариф 2 ГБ, Coolify будет душиться. Для 4 ГБ всё спокойно.
- **Deployments** — история билдов. Откат: жмёте на старый успешный билд →
  **Redeploy**.

---

## Частые ошибки

**Билд падает на `npm ci`.** Проверьте `package-lock.json` в репо — он должен
быть закоммичен.

**Билд проходит, но `/catalog` пуст.** Не выполнили миграцию или забыли вставить
ключи в env. Проверьте Logs → должно быть `[products fetched: N]`. Если пишет
ошибку RLS — миграция не применилась.

**SMS не приходит.** Supabase бесплатный план не шлёт реальные SMS — нужен
Twilio. В **Authentication → Settings → SMS** вставьте Twilio Account SID,
Auth Token и Messaging Service SID.

**HTTPS не выписался.** В Coolify приложение → **Settings → SSL** должно стоять
`Let's Encrypt`. DNS должен резолвиться на ваш IP **до** деплоя, иначе
ACME-челлендж не пройдёт. Повторите Deploy после проверки `nslookup`.

**Caddy/Traefik пишет 502.** Проверьте, что в Coolify прописан **Port: 3000**
(не 8080, не 80). Dockerfile слушает 3000.
