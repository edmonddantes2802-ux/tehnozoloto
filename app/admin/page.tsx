'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Skeleton } from '@/components/shared/Skeleton';
import { formatRub } from '@/lib/utils';
import { toast } from 'sonner';
import type { GoldPriceRow, LeadRow } from '@/types/database';

export default function AdminPage() {
  const [prices, setPrices] = useState<GoldPriceRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    Promise.all([
      supabase.from('gold_prices').select('*').order('karat'),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20),
    ]).then(([p, l]) => {
      setPrices((p.data as GoldPriceRow[]) ?? []);
      setLeads((l.data as LeadRow[]) ?? []);
      setLoading(false);
    });
  }, []);

  async function updatePrice(id: number, pricePerGram: number) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from('gold_prices')
      .update({ price_per_gram: pricePerGram, updated_at: new Date().toISOString() } as never)
      .eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Цена обновлена');
  }

  if (loading) {
    return (
      <div className="container-corp py-12">
        <Skeleton className="mb-6 h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container-corp py-12">
      <h1 className="mb-8">Админ-панель</h1>

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
                <PriceRow key={p.id} price={p} onSave={updatePrice} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Последние заявки</h2>
        {leads.length === 0 ? (
          <div className="rounded-card border border-corporate-border bg-white p-6 text-corporate-gray">
            Заявок пока нет.
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border border-corporate-border bg-white">
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
                    <td className="px-4 py-3">
                      {new Date(l.created_at).toLocaleDateString('ru-RU')}
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

function PriceRow({
  price,
  onSave,
}: {
  price: GoldPriceRow;
  onSave: (id: number, val: number) => void;
}) {
  const [val, setVal] = useState(price.price_per_gram);
  return (
    <tr className="border-t border-corporate-border">
      <td className="px-4 py-3 font-semibold">{price.karat}</td>
      <td className="px-4 py-3">
        <Input
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="h-10 w-32"
        />
      </td>
      <td className="px-4 py-3 text-corporate-muted">
        {new Date(price.updated_at).toLocaleString('ru-RU')}
      </td>
      <td className="px-4 py-3 text-right">
        <Button size="sm" onClick={() => onSave(price.id, val)}>
          Сохранить
        </Button>
      </td>
    </tr>
  );
}
