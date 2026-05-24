'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((s) => s.count());
  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleCount = mounted ? count : 0;

  return (
    <Link
      href="/cart"
      aria-label={`Корзина${visibleCount > 0 ? `, ${visibleCount} товаров` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-corp border border-corporate-border text-primary transition-colors hover:border-gold hover:text-gold"
    >
      <ShoppingCart size={18} />
      {visibleCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-white">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
