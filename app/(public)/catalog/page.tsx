import type { Metadata } from 'next';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatRub } from '@/lib/utils';
import { ProductImage } from '@/components/shared/ProductImage';
import { AddToCartButton } from '@/components/forms/AddToCartButton';
import type { ProductRow } from '@/types/database';
import { PRODUCTS } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Каталог товаров — Техно-Золото',
  description: 'Б/у смартфоны, ноутбуки и техника. Полная диагностика перед продажей.',
};

async function loadProducts(): Promise<ProductRow[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (data && data.length > 0) return data as ProductRow[];
  } catch {
    // fallback to static catalog
  }
  return PRODUCTS;
}

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const products = await loadProducts();
  return (
    <div className="bg-corporate-bg py-12">
      <div className="container-corp">
        <h1 className="mb-2">Каталог товаров</h1>
        <p className="mb-10 text-corporate-gray">
          {products.length} товаров в наличии — ежедневное обновление.
        </p>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-card border border-corporate-border bg-white p-5">
              <h3 className="mb-4 text-base font-semibold">Фильтры</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="mb-2 font-medium">Категория</div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="accent-gold" />
                    Смартфоны
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="accent-gold" />
                    Ноутбуки
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="accent-gold" />
                    Золото
                  </label>
                </div>
                <div>
                  <div className="mb-2 font-medium">Цена, ₽</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="h-10 w-full rounded-corp border border-corporate-border px-3 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="∞"
                      className="h-10 w-full rounded-corp border border-corporate-border px-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-card border border-corporate-border bg-white shadow-card-rest transition-shadow hover:shadow-card-hover"
              >
                <Link href={`/catalog/${p.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-corporate-bg">
                    {p.old_price && (
                      <span className="absolute left-3 top-3 z-10 rounded bg-danger px-2 py-1 text-xs font-bold text-white">
                        −{Math.round(100 - (p.price / p.old_price) * 100)}%
                      </span>
                    )}
                    <ProductImage
                      productId={p.id}
                      fallbackUrl={p.images[0] ?? 'https://placehold.co/800x600/F8FAFC/9CA3AF?text=No+image'}
                      alt={p.title}
                      className="transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/catalog/${p.id}`} className="block">
                    <h3 className="mb-1 text-base font-semibold hover:text-gold">
                      {p.title}
                    </h3>
                    <div className="mb-3 line-clamp-2 text-xs text-corporate-muted">
                      {p.description}
                    </div>
                  </Link>
                  <div className="mb-4 mt-auto flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {formatRub(p.price)}
                    </span>
                    {p.old_price && (
                      <span className="text-sm text-corporate-muted line-through">
                        {formatRub(p.old_price)}
                      </span>
                    )}
                  </div>
                  <AddToCartButton
                    product={{
                      productId: p.id,
                      title: p.title,
                      price: p.price,
                      image: p.images[0] ?? null,
                    }}
                    className="w-full"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
