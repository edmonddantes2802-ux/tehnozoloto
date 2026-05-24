import Link from 'next/link';
import { formatRub } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { ProductImage } from '@/components/shared/ProductImage';
import { AddToCartButton } from '@/components/forms/AddToCartButton';
import { FEATURED_PRODUCTS } from '@/lib/products-data';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ProductRow } from '@/types/database';

async function loadFeatured(): Promise<ProductRow[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .limit(4);
    if (data && data.length > 0) return data as ProductRow[];
  } catch {
    // supabase not configured locally — fallback to mock
  }
  return FEATURED_PRODUCTS.slice(0, 4);
}

export async function ShowcaseGrid() {
  const products = await loadFeatured();
  return (
    <section className="section bg-corporate-bg">
      <div className="container-corp">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mb-2">Витрина товаров</h2>
            <p className="text-corporate-gray">
              Флагманы и хиты. Все товары проверены нашими инженерами перед продажей.
            </p>
          </div>
          <Link href="/catalog">
            <Button variant="outline">Весь каталог →</Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-card border border-corporate-border bg-white shadow-card-rest transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-corporate-bg">
                {p.condition === 'new' && (
                  <span className="absolute left-3 top-3 z-10 rounded bg-success px-2 py-1 text-xs font-bold text-white">
                    НОВИНКА
                  </span>
                )}
                <ProductImage
                  productId={p.id}
                  fallbackUrl={p.images[0]}
                  alt={p.title}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-1 text-base font-semibold">{p.title}</h3>
                <div className="mb-4 line-clamp-2 text-xs text-corporate-muted">
                  {p.description}
                </div>
                <div className="mb-4 mt-auto text-xl font-bold text-primary">
                  {formatRub(p.price)}
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
    </section>
  );
}
