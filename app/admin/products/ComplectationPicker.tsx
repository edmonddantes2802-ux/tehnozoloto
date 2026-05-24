'use client';

import { useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { COMPLECTATION_PRESETS } from '@/lib/preset-complectation';
import type { ProductCategoryKey } from '@/lib/preset-models';
import { cn } from '@/lib/utils';

interface Props {
  category: ProductCategoryKey;
  value: string[];
  onChange: (next: string[]) => void;
}

export function ComplectationPicker({ category, value, onChange }: Props) {
  const [custom, setCustom] = useState('');
  const presets = COMPLECTATION_PRESETS[category] ?? COMPLECTATION_PRESETS.other;

  const selectedSet = useMemo(
    () => new Set(value.map((v) => v.trim().toLowerCase())),
    [value]
  );

  function toggle(item: string) {
    const lower = item.trim().toLowerCase();
    if (selectedSet.has(lower)) {
      onChange(value.filter((v) => v.trim().toLowerCase() !== lower));
    } else {
      onChange([...value, item]);
    }
  }

  function addCustom() {
    const v = custom.trim();
    if (!v) return;
    if (selectedSet.has(v.toLowerCase())) {
      setCustom('');
      return;
    }
    onChange([...value, v]);
    setCustom('');
  }

  function removeItem(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium">Комплектность</label>
        <span className="text-xs text-corporate-muted">
          В наборе: {value.length}
        </span>
      </div>

      {/* Пресеты для категории — клик чтобы добавить/убрать */}
      <div className="mb-3 flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = selectedSet.has(p.toLowerCase());
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-gold bg-gold/10 text-gold-dark'
                  : 'border-corporate-border bg-white text-corporate-gray hover:border-gold/60'
              )}
            >
              {active ? '✓ ' : '+ '}
              {p}
            </button>
          );
        })}
      </div>

      {/* Поле для добавления своего пункта */}
      <div className="mb-3 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Свой пункт (Enter — добавить)"
          className="h-10 flex-1 rounded-corp border border-corporate-border bg-white px-3 text-sm outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="flex h-10 items-center gap-1 rounded-corp border border-corporate-border bg-white px-3 text-xs font-semibold text-corporate-gray hover:border-gold disabled:opacity-50"
        >
          <Plus size={14} /> Добавить
        </button>
      </div>

      {/* Текущий выбранный список */}
      {value.length === 0 ? (
        <div className="rounded-corp border border-dashed border-corporate-border bg-corporate-bg p-3 text-xs text-corporate-muted">
          Пока ничего не выбрано. Нажмите на пресет выше или впишите свой пункт.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {value.map((item, idx) => (
            <li
              key={`${item}-${idx}`}
              className="flex items-center justify-between gap-2 rounded-corp border border-corporate-border bg-white px-3 py-2 text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(item)}
                aria-label="Удалить"
                className="text-corporate-gray hover:text-danger"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
