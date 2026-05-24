'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  productId: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
}

/**
 * Показывает фото товара с приоритетом:
 *   1. /products/{id}.jpg — реальная фотка вашего экземпляра
 *   2. fallbackUrl        — Unsplash по брендовой эвристике
 *   3. локальный SVG-плейсхолдер (без сетевых запросов)
 *
 * Чтобы заменить заглушку на реальное фото — положите файл
 * `public/products/{id}.jpg` (id виден в каталоге) и обновите страницу.
 */
export function ProductImage({ productId, fallbackUrl, alt, className }: Props) {
  const [src, setSrc] = useState(`/products/${productId}.jpg`);
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-gradient-to-br from-corporate-bg to-corporate-border/40 text-corporate-muted',
          className
        )}
        aria-label={alt}
        role="img"
      >
        <Package size={48} strokeWidth={1.2} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (src !== fallbackUrl) {
          setSrc(fallbackUrl);
        } else {
          setBroken(true);
        }
      }}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}
