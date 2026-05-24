'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { Button } from '@/components/shared/Button';

type Props = {
  product: CartItem;
  className?: string;
};

export function AddToCartButton({ product, className }: Props) {
  const [mounted, setMounted] = useState(false);
  const inCart = useCartStore((s) => (mounted ? s.has(product.productId) : false));
  const add = useCartStore((s) => s.add);

  // localStorage hydrates only on client — avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (inCart) {
    return (
      <Link href="/cart" className={className}>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Check size={16} className="mr-1" />
          В корзине
        </Button>
      </Link>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      className={className}
      onClick={() => {
        add(product);
        toast.success(`${product.title} добавлен в корзину`);
      }}
    >
      Купить
    </Button>
  );
}
