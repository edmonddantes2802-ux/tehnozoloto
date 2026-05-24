'use client';

import { create } from 'zustand';
import type { CalculatorTab, Karat, TechCondition } from '@/types';
import type { TechCategoryKey } from '@/services/price-calculator';

interface CalculatorState {
  tab: CalculatorTab;
  karat: Karat;
  weight: number;
  techCategory: TechCategoryKey;
  model: string;
  condition: TechCondition;
  promoApplied: boolean;
  setTab: (tab: CalculatorTab) => void;
  setKarat: (k: Karat) => void;
  setWeight: (w: number) => void;
  setTechCategory: (c: TechCategoryKey) => void;
  setModel: (m: string) => void;
  setCondition: (c: TechCondition) => void;
  setPromoApplied: (v: boolean) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  tab: 'gold',
  karat: 585,
  weight: 5,
  techCategory: 'smartphone',
  model: 'iPhone 13',
  condition: 'good',
  promoApplied: true,
  setTab: (tab) => set({ tab }),
  setKarat: (karat) => set({ karat }),
  setWeight: (weight) => set({ weight }),
  setTechCategory: (techCategory) => set({ techCategory }),
  setModel: (model) => set({ model }),
  setCondition: (condition) => set({ condition }),
  setPromoApplied: (promoApplied) => set({ promoApplied }),
}));
