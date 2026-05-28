'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useGoldPrices } from '@/hooks/useGoldPrices';
import {
  calcGoldPrice,
  calcTechPrice,
  lookupBasePrice,
  TECH_CATALOG,
  TECH_CATEGORY_LABELS,
  type TechCategoryKey,
} from '@/services/price-calculator';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Input } from '@/components/shared/Input';
import { LeadForm } from '@/components/forms/LeadForm';
import type { Karat, TechCondition } from '@/types';
import { cn } from '@/lib/utils';

const karats: Karat[] = [375, 585, 750, 999];
const conditions: { value: TechCondition; label: string; desc: string }[] = [
  { value: 'excellent', label: 'Идеальное', desc: 'Без царапин и дефектов' },
  { value: 'good', label: 'Хорошее', desc: 'Следы эксплуатации' },
  { value: 'defective', label: 'Есть дефекты', desc: 'Требует ремонта' },
];

const categoryIcons: Record<TechCategoryKey, string> = {
  smartphone: '📱',
  laptop: '💻',
  tablet: '📲',
  tv: '📺',
  console: '🎮',
  audio: '🎧',
  photo: '📷',
  watch: '⌚',
  antique: '🏺',
  sport: '🏋️',
  tools: '🔧',
  other: '📦',
};

export function Calculator() {
  const {
    tab, setTab,
    karat, setKarat,
    weight, setWeight,
    techCategory, setTechCategory,
    model, setModel,
    condition, setCondition,
  } = useCalculatorStore();

  const { getPrice } = useGoldPrices();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [modelQuery, setModelQuery] = useState('');

  const currentModels = TECH_CATALOG[techCategory];
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    currentModels.forEach((m) => m.brand && set.add(m.brand));
    return Array.from(set);
  }, [currentModels]);

  const filteredModels = useMemo(() => {
    const q = modelQuery.trim().toLowerCase();
    return currentModels.filter((m) => {
      if (brandFilter !== 'all' && m.brand !== brandFilter) return false;
      if (q && !m.name.toLowerCase().includes(q) && !(m.specs?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [currentModels, brandFilter, modelQuery]);

  const result = useMemo(() => {
    if (tab === 'gold') {
      return calcGoldPrice(weight, getPrice(karat));
    }
    return calcTechPrice(lookupBasePrice(model), condition);
  }, [tab, karat, weight, model, condition, getPrice]);

  return (
    <section id="calculator" className="section bg-gradient-to-b from-corporate-bg to-white">
      <div className="container-corp">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-3">Калькулятор оценки</h2>
          <p className="text-corporate-gray">
            Выберите категорию, укажите параметры — мгновенно увидите примерную стоимость.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-card border border-corporate-border bg-white shadow-card-hover">
          {/* Tabs */}
          <div className="relative flex border-b border-corporate-border">
            {(['gold', 'tech'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative flex-1 px-6 py-5 text-base font-semibold transition-colors',
                  tab === t ? 'text-gold-dark' : 'text-corporate-muted hover:text-corporate-dark'
                )}
              >
                {t === 'gold' ? '💎 Золото' : '📱 Техника'}
                {tab === t && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-x-6 bottom-0 h-[3px] rounded-t bg-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="grid gap-8 p-8 md:grid-cols-2">
            <AnimatePresence mode="wait">
              {tab === 'gold' ? (
                <motion.div
                  key="gold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">Проба</label>
                    <div className="grid grid-cols-4 gap-2">
                      {karats.map((k) => (
                        <button
                          key={k}
                          onClick={() => setKarat(k)}
                          className={cn(
                            'rounded-corp border-2 py-3 text-sm font-semibold transition-all',
                            karat === k
                              ? 'border-gold bg-gold/10 text-gold-dark'
                              : 'border-corporate-border text-corporate-gray hover:border-gold/50'
                          )}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Вес, грамм"
                    type="number"
                    min={0.01}
                    max={1000}
                    step={0.01}
                    inputMode="decimal"
                    placeholder="напр. 5"
                    value={weight === 0 ? '' : weight}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') {
                        setWeight(0);
                        return;
                      }
                      const n = Number(v);
                      setWeight(Number.isFinite(n) ? n : 0);
                    }}
                  />
                  <div className="rounded-corp bg-corporate-bg p-4 text-sm text-corporate-gray">
                    Цена за грамм <b className="text-gold-dark">{getPrice(karat)} ₽</b> по текущему курсу.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tech"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">Категория</label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {(Object.keys(TECH_CATALOG) as TechCategoryKey[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setTechCategory(k);
                            setModel(TECH_CATALOG[k][0]?.name ?? '');
                          }}
                          className={cn(
                            'flex flex-col items-center gap-1 rounded-corp border-2 py-3 text-xs font-medium transition-all',
                            techCategory === k
                              ? 'border-gold bg-gold/10 text-gold-dark'
                              : 'border-corporate-border text-corporate-gray hover:border-gold/50'
                          )}
                          title={TECH_CATEGORY_LABELS[k]}
                        >
                          <span className="text-xl">{categoryIcons[k]}</span>
                          <span className="leading-tight">{TECH_CATEGORY_LABELS[k]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {availableBrands.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">Производитель</label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBrandFilter('all')}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                            brandFilter === 'all'
                              ? 'border-gold bg-gold/10 text-gold-dark'
                              : 'border-corporate-border text-corporate-gray hover:border-gold'
                          )}
                        >
                          Все
                        </button>
                        {availableBrands.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBrandFilter(b)}
                            className={cn(
                              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                              brandFilter === b
                                ? 'border-gold bg-gold/10 text-gold-dark'
                                : 'border-corporate-border text-corporate-gray hover:border-gold'
                            )}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Модель {techCategory === 'laptop' && '— выберите с характеристиками'}
                    </label>
                    <input
                      list="tech-models"
                      value={modelQuery || model}
                      onChange={(e) => {
                        setModelQuery(e.target.value);
                        setModel(e.target.value);
                      }}
                      placeholder="Начните вводить название или чипсет..."
                      className="h-12 w-full rounded-corp border border-corporate-border bg-white px-4 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                    <datalist id="tech-models">
                      {currentModels.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.specs ?? ''}
                        </option>
                      ))}
                    </datalist>

                    {techCategory === 'laptop' ? (
                      <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                        {filteredModels.length === 0 ? (
                          <div className="rounded-corp bg-corporate-bg p-4 text-center text-sm text-corporate-muted">
                            Ничего не найдено. Попробуйте другой запрос.
                          </div>
                        ) : (
                          filteredModels.map((m) => (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => {
                                setModel(m.name);
                                setModelQuery('');
                              }}
                              className={cn(
                                'w-full rounded-corp border-2 p-3 text-left transition-all',
                                model === m.name
                                  ? 'border-gold bg-gold/10'
                                  : 'border-corporate-border hover:border-gold/50'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-corporate-dark">
                                    {m.name}
                                  </div>
                                  {m.specs && (
                                    <div className="mt-0.5 text-xs leading-snug text-corporate-muted">
                                      {m.specs}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-shrink-0 text-xs font-semibold text-gold-dark">
                                  ~{Math.round(m.basePrice / 1000)}к ₽
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                        {filteredModels.slice(0, 24).map((m) => (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => {
                              setModel(m.name);
                              setModelQuery('');
                            }}
                            className={cn(
                              'rounded-full border px-3 py-1 text-xs transition-colors',
                              model === m.name
                                ? 'border-gold bg-gold/10 text-gold-dark'
                                : 'border-corporate-border text-corporate-gray hover:border-gold'
                            )}
                          >
                            {m.name}
                          </button>
                        ))}
                        {filteredModels.length > 24 && (
                          <span className="px-2 py-1 text-xs text-corporate-muted">
                            +{filteredModels.length - 24} ещё — используйте поиск
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Состояние</label>
                    <div className="space-y-2">
                      {conditions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setCondition(c.value)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-corp border-2 px-4 py-3 text-left transition-all',
                            condition === c.value
                              ? 'border-gold bg-gold/10'
                              : 'border-corporate-border hover:border-gold/50'
                          )}
                        >
                          <div>
                            <div className="font-semibold text-corporate-dark">{c.label}</div>
                            <div className="text-xs text-corporate-muted">{c.desc}</div>
                          </div>
                          <div
                            className={cn(
                              'h-5 w-5 rounded-full border-2',
                              condition === c.value ? 'border-gold bg-gold' : 'border-corporate-border'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <div className="flex flex-col justify-between rounded-card bg-gradient-to-br from-primary to-corporate-dark p-6 text-white">
              <div>
                <div className="mb-2 text-sm uppercase tracking-wider text-gold">
                  Предварительная стоимость
                </div>
                <div className="mb-4 text-5xl font-bold">
                  <AnimatedCounter value={result} />
                </div>
                <p className="text-sm text-white/70">
                  Это ориентир по текущему курсу. Точная цена — после диагностики оценщиком.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadForm((v) => !v)}
                className="mt-6 w-full rounded-corp bg-gold-shine px-6 py-4 text-base font-semibold text-corporate-dark transition-transform hover:-translate-y-[1px] hover:shadow-gold-glow"
              >
                {showLeadForm ? 'Скрыть форму' : 'Получить деньги →'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showLeadForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-corporate-border"
              >
                <div className="p-8">
                  <LeadForm
                    category={tab}
                    estimatedValue={result}
                    details={
                      tab === 'gold'
                        ? { karat, weight }
                        : { category: techCategory, model, condition }
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
