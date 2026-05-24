'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLLAPSED = 5;

interface Props {
  specs: Array<[string, string | number]>;
  batteryHealth?: string | null;
}

export function SpecsList({ specs, batteryHealth }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Объединяем battery в общий список, чтобы он мог попасть в первые 5
  const rows: Array<[string, string]> = [];
  if (batteryHealth) {
    rows.push(['Состояние аккумулятора', batteryHealth]);
  }
  for (const [k, v] of specs) {
    if (v === null || v === '') continue;
    rows.push([k, String(v)]);
  }

  if (rows.length === 0) return null;

  const visible = expanded ? rows : rows.slice(0, COLLAPSED);
  const hiddenCount = rows.length - COLLAPSED;
  const hasMore = hiddenCount > 0;

  return (
    <section className="rounded-card border border-corporate-border bg-white p-6">
      <h2 className="mb-3 text-xl font-semibold">Характеристики</h2>
      <dl className="divide-y divide-corporate-border text-sm">
        {visible.map(([key, value], idx) => (
          <div key={`${key}-${idx}`} className="flex justify-between gap-4 py-2">
            <dt className="text-corporate-gray">{key}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
        >
          <ChevronDown
            size={16}
            className={cn('transition-transform', expanded && 'rotate-180')}
          />
          {expanded ? 'Свернуть' : `Развернуть подробно (+${hiddenCount})`}
        </button>
      )}
    </section>
  );
}
