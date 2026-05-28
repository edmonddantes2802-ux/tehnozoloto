'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { formatRub } from '@/lib/utils';
import { ProductImage } from '@/components/shared/ProductImage';
import { AddToCartButton } from '@/components/forms/AddToCartButton';
import { CATEGORY_LABELS } from '@/lib/preset-models';
import type { ProductRow } from '@/types/database';

const PAGE_SIZE = 12;
type SortKey = 'new' | 'price_asc' | 'price_desc';

function labelFor(cat: string): string {
  return (CATEGORY_LABELS as Record<string, string>)[cat] ?? cat;
}

function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export function CatalogClient({ products }: { products: ProductRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortKey>('new');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort((a, b) => labelFor(a).localeCompare(labelFor(b)));
  }, [products]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    let list = products.filter((p) => {
      if (selected.size > 0 && (!p.category || !selected.has(p.category))) return false;
      if (min !== null && Number.isFinite(min) && p.price < min) return false;
      if (max !== null && Number.isFinite(max) && p.price > max) return false;
      return true;
    });
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, selected, minPrice, maxPrice, sort]);

  const shown = filtered.slice(0, visible);
  const hasFilters = selected.size > 0 || minPrice !== '' || maxPrice !== '';

  function toggleCategory(cat: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setVisible(PAGE_SIZE);
  }

  function reset() {
    setSelected(new Set());
    setMinPrice('');
    setMaxPrice('');
    setSort('new');
    setVisible(PAGE_SIZE);
  }

  return (
    <>
      <p className="mb-8 text-corporate-gray">
        {filtered.length} {plural(filtered.length, ['товар', 'товара', 'товаров'])} в
        наличии — ежедневное обновление.
      </p>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Фильтры */}
        <aside>
          <div className="rounded-card border border-corporate-border bg-white p-5 lg:sticky lg:top-20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Фильтры</h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-gold-dark hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>
            <div className="space-y-5 text-sm">
              {categories.length > 0 && (
                <div>
                  <div className="mb-2 font-medium">Категория</div>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <label key={cat} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected.has(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="accent-gold"
                        />
                        {labelFor(cat)}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-2 font-medium">Цена, ₽</div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="от"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    className="h-10 w-full rounded-corp border border-corporate-border px-3 text-sm"
                  />
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="до"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    className="h-10 w-full rounded-corp border border-corporate-border px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Сетка / пусто */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-card border border-corporate-border bg-white p-10 text-center">
              <p className="mb-1 text-lg font-semibold">Ничего не найдено</p>
              <p className="mb-5 text-sm text-corporate-gray">
                Под выбранные фильтры товаров нет. Измените параметры или сбросьте фильтры.
              </p>
              <button
                type="button"
                onClick={reset}
                className="rounded-corp bg-gold-shine px-5 py-2.5 text-sm font-semibold text-corporate-dark transition-transform hover:-translate-y-[1px]"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-end gap-2 text-sm">
                <label htmlFor="catalog-sort" className="text-corporate-gray">
                  Сортировка:
                </label>
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-9 rounded-corp border border-corporate-border bg-white px-2 text-sm outline-none focus:border-gold"
                >
                  <option value="new">Сначала новые</option>
                  <option value="price_asc">Сначала дешевле</option>
                  <option value="price_desc">Сначала дороже</option>
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((p) => (
                  <article
                    key={p.id}
                    className="flex flex-col overflow-hidden rounded-card border border-corporate-border bg-white shadow-card-rest transition-shadow hover:shadow-card-hover"
                  >
                    <Link href={`/catalog/${p.id}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-corporate-bg">
                        {p.old_price && p.old_price > p.price && (
                          <span className="absolute left-3 top-3 z-10 rounded bg-danger px-2 py-1 text-xs font-bold text-white">
                            −{Math.round(100 - (p.price / p.old_price) * 100)}%
                          </span>
                        )}
                        <ProductImage
                          productId={p.id}
                          fallbackUrl={
                            p.images[0] ??
                            'https://placehold.co/800x600/F8FAFC/9CA3AF?text=No+image'
                          }
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
                        {p.old_price && p.old_price > p.price && (
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

              {visible < filtered.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-corp border-2 border-gold px-6 py-3 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/10"
                  >
                    Показать ещё ({filtered.length - visible})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
