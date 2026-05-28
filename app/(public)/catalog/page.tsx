import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import type { ProductRow } from '@/types/database';
import { PRODUCTS } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Каталог товаров — Техно-Золото',
  description: 'Б/у смартфоны, ноутбуки и техника. Полная диагностика перед продажей.',
};

async function loadProducts(): Promise<ProductRow[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (data && data.length > 0) return data as ProductRow[];
  } catch {
    // fallback to static catalog
  }
  return PRODUCTS;
}

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const products = await loadProducts();
  return (
    <div className="bg-corporate-bg py-12">
      <div className="container-corp">
        <h1 className="mb-2">Каталог товаров</h1>
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
