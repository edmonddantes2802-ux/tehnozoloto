'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { GoldPriceRow, Karat } from '@/types/database';

const FALLBACK_PRICES: GoldPriceRow[] = [
  { id: 1, karat: 375, price_per_gram: 2200, updated_at: new Date().toISOString() },
  { id: 2, karat: 585, price_per_gram: 3500, updated_at: new Date().toISOString() },
  { id: 3, karat: 750, price_per_gram: 4500, updated_at: new Date().toISOString() },
  { id: 4, karat: 999, price_per_gram: 6100, updated_at: new Date().toISOString() },
];

export function useGoldPrices() {
  const [prices, setPrices] = useState<GoldPriceRow[]>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip entirely if Supabase isn't configured — fallback prices stay.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    supabase
      .from('gold_prices')
      .select('*')
      .order('karat', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (!error && data && data.length > 0) {
          setPrices(data as GoldPriceRow[]);
        }
        setLoading(false);
      });

    // Unique channel name per effect run — avoids StrictMode double-subscribe.
    const channelName = `gold_prices_${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gold_prices' },
        () => {
          supabase
            .from('gold_prices')
            .select('*')
            .order('karat', { ascending: true })
            .then(({ data }) => {
              if (mounted && data) setPrices(data as GoldPriceRow[]);
            });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getPrice = (karat: Karat) =>
    prices.find((p) => p.karat === karat)?.price_per_gram ?? 0;

  return { prices, getPrice, loading };
}
