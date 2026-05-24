'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string | null;
}

export type DeliveryMethod = 'pickup' | 'courier_msk' | 'regions';

interface CartState {
  items: CartItem[];
  delivery: DeliveryMethod;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  setDelivery: (m: DeliveryMethod) => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      delivery: 'pickup',
      add: (item) =>
        set((state) =>
          state.items.find((i) => i.productId === item.productId)
            ? state
            : { items: [...state.items, item] }
        ),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [], delivery: 'pickup' }),
      has: (productId) => !!get().items.find((i) => i.productId === productId),
      setDelivery: (delivery) => set({ delivery }),
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),
      count: () => get().items.length,
    }),
    {
      name: 'tehno-zoloto-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, delivery: s.delivery }),
    }
  )
);
