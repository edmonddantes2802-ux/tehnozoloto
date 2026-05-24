'use client';

import { useState } from 'react';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { GoldPriceRow } from '@/types/database';

export function AdminPriceRow({
  price,
  action,
}: {
  price: GoldPriceRow;
  action: (formData: FormData) => Promise<void>;
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
        <form action={action}>
          <input type="hidden" name="id" value={price.id} />
          <input type="hidden" name="price" value={val} />
          <Button size="sm" type="submit">
            Сохранить
          </Button>
        </form>
      </td>
    </tr>
  );
}
