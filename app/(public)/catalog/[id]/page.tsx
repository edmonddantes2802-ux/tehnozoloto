import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Clock, BadgeCheck } from 'lucide-react';
import { adminSelect, isAdminConfigured } from '@/lib/supabase/rest';
import { Button } from '@/components/shared/Button';
import { AddToCartButton } from '@/components/forms/AddToCartButton';
import { formatRub } from '@/lib/utils';
import { LEGAL } from '@/lib/legal';
import { CATEGORY_LABELS, type ProductCategoryKey } from '@/lib/preset-models';
import type { ProductRow } from '@/types/database';
import { ProductGallery } from './ProductGallery';
import { SpecsList } from './SpecsList';

export const dynamic = 'force-dynamic';

const CONDITION_LABEL: Record<string, string> = {
  new: 'Новый',
  excellent: 'Отличное',
  good: 'Хорошее',
  fair: 'Удовлетворительное',
};

async function loadProduct(id: string): Promise<ProductRow | null> {
  if (!isAdminConfigured()) return null;
  // Тут можно было бы использовать anon-ключ с RLS, но проще через admin —
  // мы и так серверный код, страница динамическая.
  const rows = await adminSelect<ProductRow>(
    'products',
    `id=eq.${encodeURIComponent(id)}&limit=1`
  );
  const p = rows[0];
  if (!p || p.is_sold || !p.is_published) return null;
  return p;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await loadProduct(params.id);
  if (!p) return { title: 'Товар не найден' };
  return {
    title: `${p.title} — ${formatRub(p.price)} | Техно-Золото`,
    description: p.description ?? `Купить ${p.title} в комиссионном магазине Техно-Золото.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await loadProduct(params.id);
  if (!product) notFound();

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(100 - (product.price / product.old_price) * 100)
      : 0;
  const categoryLabel = product.category
    ? CATEGORY_LABELS[product.category as ProductCategoryKey] ?? product.category
    : null;
  const specs = product.specs ?? {};

  return (
    <div className="bg-corporate-bg py-10">
      <div className="container-corp">
        <Link
          href="/catalog"
          className="mb-4 inline-block text-sm text-corporate-gray hover:text-gold"
        >
          ← Назад в каталог
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Левая колонка — галерея */}
          <ProductGallery
            productId={product.id}
            images={product.images}
            title={product.title}
          />

          {/* Правая колонка — инфо + покупка */}
          <aside className="space-y-6">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {categoryLabel && (
                  <span className="inline-block rounded bg-gold/10 px-2 py-1 text-xs font-semibold text-gold-dark">
                    {categoryLabel}
                  </span>
                )}
                {product.brand && (
                  <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    {product.brand}
                  </span>
                )}
              </div>
              <h1 className="mb-2 text-2xl font-bold leading-tight md:text-3xl">
                {product.title}
              </h1>
              {product.condition && (
                <div className="flex items-center gap-2 text-sm text-corporate-gray">
                  <BadgeCheck size={16} className="text-success" />
                  Состояние: <strong>{CONDITION_LABEL[product.condition]}</strong>
                </div>
              )}
            </div>

            <div className="rounded-card border border-corporate-border bg-white p-6">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatRub(product.price)}
                </span>
                {product.old_price && product.old_price > product.price && (
                  <>
                    <span className="text-base text-corporate-muted line-through">
                      {formatRub(product.old_price)}
                    </span>
                    <span className="rounded bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">
                      −{discount}%
                    </span>
                  </>
                )}
              </div>

              <AddToCartButton
                product={{
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.images[0] ?? null,
                }}
                className="w-full"
              />

              <p className="mt-3 text-xs text-corporate-muted">
                Оплата картой через ЮKassa после оформления заказа. Фискальный
                чек по 54-ФЗ — автоматически на email/телефон.
              </p>
            </div>

            {/* Локация магазина */}
            <div className="rounded-card border border-corporate-border bg-white p-6">
              <div className="mb-3 text-sm font-semibold text-primary">
                Где забрать
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                <div>
                  <div className="font-medium">{LEGAL.pickupAddress}</div>
                  <div className="mt-1 text-corporate-muted">
                    Магазин «{LEGAL.brand}»
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3 text-sm">
                <Clock size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                <div>{LEGAL.workingHours}</div>
              </div>
              <div className="mt-3 flex items-start gap-3 text-sm">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold-dark" />
                <a href={LEGAL.phoneRaw} className="hover:text-gold">
                  {LEGAL.phone}
                </a>
              </div>
              <Link
                href="/delivery"
                className="mt-4 inline-block text-sm font-semibold text-gold hover:underline"
              >
                Способы доставки →
              </Link>
            </div>
          </aside>
        </div>

        {/* Описание, характеристики и комплектность — вертикально, во всю ширину */}
        <div className="mt-10 space-y-6">
          {product.description && (
            <section className="rounded-card border border-corporate-border bg-white p-6">
              <h2 className="mb-3 text-xl font-semibold">Описание</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-corporate-gray">
                {product.description}
              </p>
            </section>
          )}

          {product.complectation && product.complectation.length > 0 && (
            <section className="rounded-card border border-corporate-border bg-white p-6">
              <h2 className="mb-3 text-xl font-semibold">В комплекте</h2>
              <ul className="grid gap-2 text-sm text-corporate-gray sm:grid-cols-2">
                {product.complectation.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SpecsList
            specs={Object.entries(specs)
              .filter(([, v]) => v !== null && v !== undefined)
              .map(([k, v]) => [k, v as string | number])}
            batteryHealth={product.battery_health}
          />
        </div>

        <div className="mt-10 text-center">
          <Link href="/catalog">
            <Button variant="outline">Весь каталог →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
