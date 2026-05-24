'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useGoldPrices } from '@/hooks/useGoldPrices';
import { formatRub } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';
import { CartIcon } from '@/components/layout/CartIcon';

const navItems = [
  { href: '/#calculator', label: 'Оценка' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/#about', label: 'О нас' },
  { href: '/#contacts', label: 'Контакты' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { getPrice } = useGoldPrices();
  const price585 = getPrice(585);

  return (
    <header className="sticky top-0 z-40 border-b border-corporate-border bg-white/95 backdrop-blur">
      <div className="container-corp flex h-16 items-center justify-between">
        <Link href="/" className="text-primary">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-corporate-gray transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right text-xs leading-tight">
            <div className="text-corporate-muted">Золото 585</div>
            <div className="font-semibold text-gold">{formatRub(price585)}/г</div>
          </div>
          <CartIcon />
          <Link
            href="/profile"
            aria-label="Личный кабинет"
            className="flex h-10 w-10 items-center justify-center rounded-corp border border-corporate-border text-primary hover:border-gold hover:text-gold"
          >
            <User size={18} />
          </Link>
        </div>

        <button
          className="md:hidden"
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all md:hidden',
          open ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="container-corp flex flex-col gap-1 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-corp px-3 py-3 text-sm font-medium text-corporate-gray hover:bg-corporate-bg"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="rounded-corp px-3 py-3 text-sm font-medium text-corporate-gray hover:bg-corporate-bg"
          >
            Личный кабинет
          </Link>
        </nav>
      </div>
    </header>
  );
}
