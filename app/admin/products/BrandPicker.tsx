'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  TOP_BRANDS_BY_CATEGORY,
  brandsInPresetsForCategory,
  type ProductCategoryKey,
} from '@/lib/preset-models';
import { cn } from '@/lib/utils';

interface Props {
  category: ProductCategoryKey;
  value: string;
  onChange: (brand: string) => void;
}

export function BrandPicker({ category, value, onChange }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [customMode, setCustomMode] = useState(false);

  // Top-10 (или меньше) для категории.
  const topBrands = TOP_BRANDS_BY_CATEGORY[category] ?? [];

  // Все бренды, которые реально встречаются в preset для этой категории.
  const realBrands = useMemo(
    () => brandsInPresetsForCategory(category),
    [category]
  );

  // Полный список: top сверху + остальные из preset, исключая дубликаты.
  const restBrands = useMemo(() => {
    const topSet = new Set(topBrands);
    return realBrands.filter((b) => !topSet.has(b)).sort();
  }, [topBrands, realBrands]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium">Бренд</label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setCustomMode(false);
            }}
            className="flex items-center gap-1 text-xs text-corporate-gray hover:text-danger"
          >
            <X size={12} /> Сбросить
          </button>
        )}
      </div>

      {customMode ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Введите бренд вручную"
            autoFocus
            className="h-10 flex-1 rounded-corp border border-corporate-border bg-white px-3 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => setCustomMode(false)}
            className="rounded-corp border border-corporate-border bg-white px-3 text-xs text-corporate-gray hover:border-gold"
          >
            Назад
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Top-10 чипсы */}
          <div className="flex flex-wrap gap-2">
            {topBrands.map((brand) => {
              const active = value === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onChange(brand)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    active
                      ? 'border-gold bg-gold/10 text-gold-dark'
                      : 'border-corporate-border bg-white text-corporate-gray hover:border-gold/60'
                  )}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Спойлер «другие бренды» */}
          {(restBrands.length > 0 || true) && (
            <div>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                <ChevronDown
                  size={14}
                  className={cn('transition-transform', showAll && 'rotate-180')}
                />
                {showAll ? 'Скрыть' : 'Другие бренды'}
                {restBrands.length > 0 && ` (${restBrands.length})`}
              </button>
              {showAll && (
                <div className="mt-2 space-y-2">
                  {restBrands.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {restBrands.map((brand) => {
                        const active = value === brand;
                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => onChange(brand)}
                            className={cn(
                              'rounded-full border px-3 py-1 text-xs transition-colors',
                              active
                                ? 'border-gold bg-gold/10 text-gold-dark'
                                : 'border-corporate-border bg-white text-corporate-gray hover:border-gold/60'
                            )}
                          >
                            {brand}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setCustomMode(true)}
                    className="text-xs text-corporate-gray hover:text-gold"
                  >
                    + Указать свой бренд
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Если выбран бренд, которого нет в top, покажем его как чипс */}
          {value && !topBrands.includes(value) && (
            <div className="rounded-corp border border-gold/40 bg-gold/5 px-3 py-2 text-xs">
              Выбран: <strong>{value}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
