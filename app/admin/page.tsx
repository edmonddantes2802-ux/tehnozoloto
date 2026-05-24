import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { formatRub } from '@/lib/utils';
import { AdminPriceRow } from './AdminPriceRow';
import { AdminMarkSoldButton } from './AdminMarkSoldButton';
import type { GoldPriceRow, LeadRow } from '@/types/database';

interface OrderItem {
  product_id: string;
  title: string;
  price: number;
}

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  delivery_method: 'pickup' | 'courier_msk' | 'regions';
  items: OrderItem[];
  total: number;
  status: string;
  paid_at: string | null;
}

const deliveryLabel: Record<string, string> = {
  pickup: 'Самовывоз',
  courier_msk: 'По Москве',
  regions: 'В регионы',
};

const statusBadge: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  paid: 'bg-success/10 text-success',
  cancelled: 'bg-corporate-border text-corporate-gray',
  refunded: 'bg-corporate-border text-corporate-gray',
  shipped: 'bg-gold/10 text-gold-dark',
  completed: 'bg-success/10 text-success',
};

export const dynamic = 'force-dynamic';

async function loadData() {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { prices: [], leads: [], orders: [], configured: false };
  }
  const [pricesRes, leadsRes, ordersRes] = await Promise.all([
    admin.from('gold_prices').select('*').order('karat'),
    admin.from('leads').select('*').order('created_at', { ascending: false }).limit(50),
    admin.from('orders' as never).select('*').order('created_at', { ascending: false }).limit(50),
  ]);
  return {
    prices: (pricesRes.data as GoldPriceRow[]) ?? [],
    leads: (leadsRes.data as LeadRow[]) ?? [],
    orders: (ordersRes.data as unknown as OrderRow[]) ?? [],
    configured: true,
  };
}

async function updatePriceAction(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  const pricePerGram = Number(formData.get('price'));
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin
    .from('gold_prices')
    .update({ price_per_gram: pricePerGram, updated_at: new Date().toISOString() } as never)
    .eq('id', id);
  revalidatePath('/admin');
}

async function markSoldAction(formData: FormData) {
  'use server';
  const ids = String(formData.get('product_ids') ?? '').split(',').filter(Boolean);
  if (ids.length === 0) return;
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin
    .from('products' as never)
    .update({ is_sold: true } as never)
    .in('id', ids);
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/catalog');
}

async function setOrderStatusAction(formData: FormData) {
  'use server';
  const id = String(formData.get('order_id'));
  const status = String(formData.get('status'));
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin
    .from('orders' as never)
    .update({
      status,
      paid_at: status === 'paid' ? new Date().toISOString() : null,
    } as never)
    .eq('id', id);
  revalidatePath('/admin');
}

export default async function AdminPage() {
  const { prices, leads, orders, configured } = await loadData();

  return (
    <div className="container-corp py-12">
      <h1 className="mb-8">Админ-панель</h1>

      {!configured && (
        <div className="mb-8 rounded-card border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          SUPABASE_SERVICE_ROLE_KEY не задан в env — данные не загружаются.
        </div>
      )}

      {/* Orders */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Заказы из корзины</h2>
        {orders.length === 0 ? (
          <div className="rounded-card border border-corporate-border bg-white p-6 text-corporate-gray">
            Заказов пока нет.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-card border border-corporate-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-corporate-bg text-left">
                <tr>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Клиент</th>
                  <th className="px-4 py-3">Товары</th>
                  <th className="px-4 py-3">Доставка</th>
                  <th className="px-4 py-3">Сумма</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const productIds = (o.items ?? [])
                    .map((i) => i.product_id)
                    .filter(Boolean);
                  return (
                    <tr key={o.id} className="border-t border-corporate-border align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-xs">
                        {new Date(o.created_at).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customer_name}</div>
                        <div className="text-xs text-corporate-muted">{o.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {(o.items ?? []).map((i) => (
                          <div key={i.product_id}>
                            {i.title} — {formatRub(i.price)}
                          </div>
                        ))}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs">
                        {deliveryLabel[o.delivery_method] ?? o.delivery_method}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold">
                        {formatRub(o.total)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                            statusBadge[o.status] ?? statusBadge.pending
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {o.status !== 'paid' && (
                            <form action={setOrderStatusAction}>
                              <input type="hidden" name="order_id" value={o.id} />
                              <input type="hidden" name="status" value="paid" />
                              <button
                                type="submit"
                                className="rounded border border-success/40 bg-success/10 px-2 py-1 text-xs font-semibold text-success hover:bg-success/20"
                              >
                                Оплачено
                              </button>
                            </form>
                          )}
                          <AdminMarkSoldButton
                            productIds={productIds}
                            action={markSoldAction}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Gold prices */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Цены на золото</h2>
        <div className="overflow-hidden rounded-card border border-corporate-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-corporate-bg text-left">
              <tr>
                <th className="px-4 py-3">Проба</th>
                <th className="px-4 py-3">Цена за грамм, ₽</th>
                <th className="px-4 py-3">Обновлено</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <AdminPriceRow key={p.id} price={p} action={updatePriceAction} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Leads */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Заявки на оценку / связь</h2>
        {leads.length === 0 ? (
          <div className="rounded-card border border-corporate-border bg-white p-6 text-corporate-gray">
            Заявок пока нет.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-card border border-corporate-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-corporate-bg text-left">
                <tr>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Имя</th>
                  <th className="px-4 py-3">Телефон</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Оценка</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-corporate-border">
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {new Date(l.created_at).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">{l.full_name}</td>
                    <td className="px-4 py-3">{l.phone}</td>
                    <td className="px-4 py-3">{l.category}</td>
                    <td className="px-4 py-3">
                      {l.estimated_value ? formatRub(l.estimated_value) : '—'}
                    </td>
                    <td className="px-4 py-3">{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
