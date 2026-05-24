import Link from 'next/link';
import { Plus, Edit, Image as ImageIcon } from 'lucide-react';
import { adminSelect, isAdminConfigured } from '@/lib/supabase/rest';
import { Button } from '@/components/shared/Button';
import { formatRub } from '@/lib/utils';
import { CATEGORY_LABELS, type ProductCategoryKey } from '@/lib/preset-models';
import { deleteProduct } from './actions';
import type { ProductRow } from '@/types/database';

export const dynamic = 'force-dynamic';

interface SP {
  q?: string;
  status?: 'all' | 'published' | 'drafts' | 'sold';
}

async function loadProducts(sp: SP): Promise<ProductRow[]> {
  if (!isAdminConfigured()) return [];
  const filters: string[] = ['order=created_at.desc', 'limit=200'];
  if (sp.status === 'published') filters.push('is_published=eq.true', 'is_sold=eq.false');
  else if (sp.status === 'drafts') filters.push('is_published=eq.false');
  else if (sp.status === 'sold') filters.push('is_sold=eq.true');
  if (sp.q) filters.push(`title=ilike.*${encodeURIComponent(sp.q)}*`);
  return adminSelect<ProductRow>('products', filters.join('&'));
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const products = await loadProducts(searchParams);
  const status = searchParams.status ?? 'all';

  const tabs: { id: NonNullable<SP['status']>; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'published', label: 'Опубликованные' },
    { id: 'drafts', label: 'Черновики' },
    { id: 'sold', label: 'Проданные' },
  ];

  return (
    <div className="container-corp py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-block text-sm text-corporate-gray hover:text-gold"
          >
            ← В админ-панель
          </Link>
          <h1 className="mt-1">Товары</h1>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={18} className="mr-1" /> Новый товар
          </Button>
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q ?? ''}
          placeholder="Поиск по названию"
          className="h-10 flex-1 rounded-corp border border-corporate-border bg-white px-4 text-sm outline-none focus:border-gold"
        />
        <input type="hidden" name="status" value={status} />
        <Button type="submit" size="sm" variant="outline">
          Найти
        </Button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const params = new URLSearchParams();
          if (t.id !== 'all') params.set('status', t.id);
          if (searchParams.q) params.set('q', searchParams.q);
          const href = `/admin/products${params.size > 0 ? `?${params.toString()}` : ''}`;
          const active = status === t.id;
          return (
            <Link
              key={t.id}
              href={href}
              className={`rounded-corp px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold text-white'
                  : 'border border-corporate-border bg-white text-corporate-gray hover:border-gold/60'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {!isAdminConfigured() && (
        <div className="rounded-card border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          SUPABASE_SERVICE_ROLE_KEY не задан — данные не загружаются.
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-card border border-corporate-border bg-white p-8 text-center text-corporate-gray">
          Товаров не найдено. Создайте первый через кнопку «Новый товар».
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-corporate-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-corporate-bg text-left">
              <tr>
                <th className="px-4 py-3" style={{ width: 80 }}>
                  Фото
                </th>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3 whitespace-nowrap">Бренд</th>
                <th className="px-4 py-3 whitespace-nowrap">Категория</th>
                <th className="px-4 py-3 whitespace-nowrap">Цена</th>
                <th className="px-4 py-3 whitespace-nowrap">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-corporate-border align-middle">
                  <td className="px-4 py-3">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-12 w-12 rounded-corp object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-corp bg-corporate-bg text-corporate-muted">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    {p.description && (
                      <div className="line-clamp-1 text-xs text-corporate-muted">
                        {p.description}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-corporate-gray">
                    {p.brand ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-corporate-gray">
                    {CATEGORY_LABELS[p.category as ProductCategoryKey] ?? p.category}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">
                    {formatRub(p.price)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {p.is_sold ? (
                      <span className="rounded bg-corporate-border/60 px-2 py-1 text-[11px] font-semibold text-corporate-gray">
                        Продано
                      </span>
                    ) : p.is_published ? (
                      <span className="rounded bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
                        Опубликован
                      </span>
                    ) : (
                      <span className="rounded bg-warning/10 px-2 py-1 text-[11px] font-semibold text-warning">
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit size={14} className="mr-1" /> Редактировать
                        </Button>
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded border border-danger/40 bg-danger/10 px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/20"
                          formAction={deleteProduct}
                        >
                          Удалить
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
