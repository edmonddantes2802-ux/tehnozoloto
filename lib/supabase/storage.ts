'use client';

// Клиентский upload в Supabase Storage. Используется в админ-форме товара.
//
// Pipeline:
//   1. Браузер ресайзит фото до 1920px по длинной стороне (canvas + WebP/JPEG)
//   2. POST в Supabase Storage REST API с anon-ключом
//   3. Возвращает public URL для записи в products.images[]
//
// Бакет: 'product-images' (public, max 5MB, image/* mime).

const BUCKET = 'product-images';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MAX_DIMENSION = 1920;
const TARGET_QUALITY = 0.88;

export interface UploadResult {
  publicUrl: string;
  path: string;
}

/**
 * Сжимает изображение в браузере до MAX_DIMENSION по длинной стороне.
 * Возвращает Blob в формате image/jpeg (надёжнее WebP для совместимости).
 */
async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > height && width > MAX_DIMENSION) {
        height = Math.round((MAX_DIMENSION / width) * height);
        width = MAX_DIMENSION;
      } else if (height > MAX_DIMENSION) {
        width = Math.round((MAX_DIMENSION / height) * width);
        height = MAX_DIMENSION;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context недоступен'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Не удалось получить Blob из canvas'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        TARGET_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не удалось загрузить изображение для ресайза'));
    };
    img.src = url;
  });
}

function randomKey(): string {
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}

/**
 * Загружает один файл в Supabase Storage. Возвращает publicUrl.
 * onProgress опционально — для прогресс-бара в форме.
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error('Supabase env не задан');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Поддерживаются только изображения');
  }
  const blob = await resizeImage(file);
  const path = `${randomKey()}.jpg`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'false',
    },
    body: blob,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage ${res.status}: ${text}`);
  }
  return {
    publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
    path,
  };
}

/**
 * Извлекает имя файла из публичного URL Storage. Нужно для удаления.
 * Возвращает null если URL не из нашего бакета.
 */
export function pathFromPublicUrl(url: string): string | null {
  if (!SUPABASE_URL) return null;
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}
