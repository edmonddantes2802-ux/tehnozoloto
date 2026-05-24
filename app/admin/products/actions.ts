'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  adminInsert,
  adminUpdate,
  adminSelect,
  isAdminConfigured,
} from '@/lib/supabase/rest';
import type { ProductRow, ProductSpecs } from '@/types/database';

const VALID_CATEGORIES = [
  'smartphone',
  'laptop',
  'tablet',
  'console',
  'audio',
  'tool',
  'gold',
  'other',
];

const VALID_CONDITIONS = ['new', 'excellent', 'good', 'fair'];

interface ProductFormData {
  id?: string;
  title: string;
  description: string;
  price: number;
  old_price: number | null;
  category: string;
  condition: string;
  is_published: boolean;
  battery_health: number | null;
  specs: ProductSpecs;
  images: string[];
}

function parseFormData(formData: FormData): ProductFormData {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price = Number(formData.get('price') ?? 0);
  const oldPriceRaw = formData.get('old_price');
  const old_price = oldPriceRaw ? Number(oldPriceRaw) || null : null;
  const category = String(formData.get('category') ?? 'other');
  const condition = String(formData.get('condition') ?? 'good');
  const is_published = formData.get('is_published') === 'on';
  const batteryRaw = formData.get('battery_health');
  const battery_health =
    batteryRaw && String(batteryRaw).length > 0 ? Number(batteryRaw) : null;

  // specs приходит как JSON-строка (заполняется на клиенте через скрытое поле)
  let specs: ProductSpecs = {};
  const specsJson = formData.get('specs_json');
  if (typeof specsJson === 'string' && specsJson.length > 0) {
    try {
      specs = JSON.parse(specsJson);
    } catch {
      specs = {};
    }
  }

  // images приходит как JSON-массив URL-ов (поле в форме заполняется JS)
  let images: string[] = [];
  const imagesJson = formData.get('images_json');
  if (typeof imagesJson === 'string' && imagesJson.length > 0) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed)) images = parsed.filter((u) => typeof u === 'string');
    } catch {
      images = [];
    }
  }

  return {
    id: (formData.get('id') as string) || undefined,
    title,
    description,
    price,
    old_price,
    category: VALID_CATEGORIES.includes(category) ? category : 'other',
    condition: VALID_CONDITIONS.includes(condition) ? condition : 'good',
    is_published,
    battery_health:
      battery_health !== null && battery_health >= 0 && battery_health <= 100
        ? battery_health
        : null,
    specs,
    images,
  };
}

export async function createProduct(formData: FormData) {
  if (!isAdminConfigured()) {
    throw new Error('Supabase admin не настроен');
  }
  const data = parseFormData(formData);
  if (!data.title || data.price < 0) {
    throw new Error('Не заполнено название или некорректная цена');
  }
  const insertRes = await adminInsert<{ id: string }>(
    'products',
    {
      title: data.title,
      description: data.description || null,
      price: data.price,
      old_price: data.old_price,
      category: data.category,
      condition: data.condition,
      is_published: data.is_published,
      battery_health: data.battery_health,
      specs: data.specs,
      images: data.images,
    },
    true
  );
  if (!insertRes.ok || !insertRes.row) {
    throw new Error('Не удалось создать товар: ' + (insertRes.error ?? ''));
  }
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
  redirect(`/admin/products`);
}

export async function updateProduct(formData: FormData) {
  if (!isAdminConfigured()) {
    throw new Error('Supabase admin не настроен');
  }
  const data = parseFormData(formData);
  if (!data.id) throw new Error('Нет id товара');
  const res = await adminUpdate('products', `id=eq.${encodeURIComponent(data.id)}`, {
    title: data.title,
    description: data.description || null,
    price: data.price,
    old_price: data.old_price,
    category: data.category,
    condition: data.condition,
    is_published: data.is_published,
    battery_health: data.battery_health,
    specs: data.specs,
    images: data.images,
  });
  if (!res.ok) {
    throw new Error('Не удалось сохранить товар: ' + (res.error ?? ''));
  }
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${data.id}`);
  revalidatePath(`/catalog/${data.id}`);
  revalidatePath('/catalog');
  revalidatePath('/');
  redirect(`/admin/products`);
}

export async function deleteProduct(formData: FormData) {
  if (!isAdminConfigured()) return;
  const id = formData.get('id');
  if (typeof id !== 'string') return;
  // Soft-delete через is_sold + is_published — данные остаются для истории заказов.
  await adminUpdate('products', `id=eq.${encodeURIComponent(id)}`, {
    is_sold: true,
    is_published: false,
  });
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function fetchProductById(id: string): Promise<ProductRow | null> {
  if (!isAdminConfigured()) return null;
  const rows = await adminSelect<ProductRow>(
    'products',
    `id=eq.${encodeURIComponent(id)}&limit=1`
  );
  return rows[0] ?? null;
}
