'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { ProductImage } from '@/components/shared/ProductImage';
import { cn } from '@/lib/utils';

export function ProductGallery({
  productId,
  images,
  title,
}: {
  productId: string;
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-card border border-corporate-border bg-corporate-bg text-corporate-muted">
        <Package size={64} strokeWidth={1.2} />
      </div>
    );
  }
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-card border border-corporate-border bg-corporate-bg">
        <ProductImage
          productId={productId}
          fallbackUrl={current}
          alt={title}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Следующее"
              onClick={() => setActive((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-5">
          {images.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                'overflow-hidden rounded-corp border-2 transition',
                idx === active
                  ? 'border-gold'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
