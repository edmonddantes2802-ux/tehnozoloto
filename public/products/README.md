# Фото товаров

Положите сюда фото ваших реальных экземпляров в формате `{id}.jpg` —
они автоматически заменят Unsplash-заглушки на сайте.

## Как это работает

Компонент [`ProductImage`](../../components/shared/ProductImage.tsx) сначала
пробует загрузить `/products/{id}.jpg`. Если файла нет (404) — показывается
фолбэк из [`lib/products-data.ts`](../../lib/products-data.ts).

## ID товаров

ID указаны в `lib/products-data.ts` — это просто порядковый номер товара
(1-based). Например:

| id | Товар |
| :-- | :-- |
| 1  | Philips Xenium E111 |
| 16 | Makita GA7020 (УШМ) |
| 19 | iPhone 11 128GB |
| 30 | Samsung Galaxy S22 Ultra 256GB |
| 47 | MacBook Air 13" M1 256GB |
| 53 | iPhone 17 Pro 256GB |
| 54 | iPhone 17 Pro 256GB eSIM |

## Рекомендации к фото

- **Формат:** JPG (имя файла обязательно `.jpg`)
- **Размер:** 1200×900 (соотношение 4:3)
- **Вес:** до 300 КБ — оптимизируйте через [squoosh.app](https://squoosh.app)
- **Фон:** однотонный светлый (белый или `#F8FAFC`)
- **Ракурс:** вид спереди, устройство центрировано

## Массовое переименование

Если у вас файлы названы по моделям (`iphone-15-pro-max.jpg`), проще всего
переименовать их в Windows PowerShell:

```powershell
# В папке public/products
Rename-Item "iphone-17-pro.jpg" "53.jpg"
Rename-Item "macbook-air-m1.jpg" "47.jpg"
```
