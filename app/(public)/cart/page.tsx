'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';
import { MapPin, Truck, Package, Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore, type DeliveryMethod } from '@/store/cartStore';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ProductImage } from '@/components/shared/ProductImage';
import { leadSchema, type LeadInput } from '@/lib/validators';
import { formatRub, normalizePhone, cn } from '@/lib/utils';
import { LEGAL } from '@/lib/legal';

const deliveryOptions: {
  id: DeliveryMethod;
  title: string;
  description: string;
  price: string;
  icon: typeof MapPin;
}[] = [
  {
    id: 'pickup',
    title: 'Самовывоз',
    description: `${LEGAL.pickupAddress}. ${LEGAL.workingHours}.`,
    price: 'Бесплатно',
    icon: MapPin,
  },
  {
    id: 'courier_msk',
    title: 'Доставка по Москве',
    description: 'Яндекс Go или Достависта. Курьер согласует время по телефону.',
    price: 'По тарифу сервиса',
    icon: Truck,
  },
  {
    id: 'regions',
    title: 'Доставка в регионы',
    description: 'Авито Доставка, СДЭК, Почта России, Яндекс Доставка. Способ выберем с менеджером.',
    price: 'По тарифу перевозчика',
    icon: Package,
  },
];

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const delivery = useCartStore((s) => s.delivery);
  const setDelivery = useCartStore((s) => s.setDelivery);
  const remove = useCartStore((s) => s.remove);
  const total = useCartStore((s) => s.total());
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      category: 'tech',
      gdpr: false as unknown as true,
      website: '',
    },
  });

  async function onSubmit(data: LeadInput) {
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            full_name: data.full_name,
            phone: normalizePhone(data.phone),
          },
          items: items.map((i) => ({
            product_id: i.productId,
            title: i.title,
            price: i.price,
          })),
          delivery,
          total,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? `Ошибка ${res.status}`);
        return;
      }
      if (json.confirmation_url) {
        clear();
        window.location.href = json.confirmation_url;
        return;
      }
      // ЮKassa not configured yet — manager will contact
      toast.success(
        'Заказ принят. Менеджер пришлёт ссылку на оплату в течение 10 минут.'
      );
      clear();
    } catch {
      toast.error('Сетевая ошибка. Попробуйте ещё раз.');
    }
  }

  if (!mounted) {
    return (
      <div className="bg-corporate-bg py-12">
        <div className="container-corp max-w-3xl">
          <h1 className="mb-6">Корзина</h1>
          <div className="h-40 animate-pulse rounded-card bg-white" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-corporate-bg py-16">
        <div className="container-corp max-w-xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-corporate-border/40 text-corporate-muted">
            <ShoppingCart size={28} />
          </div>
          <h1 className="mb-3">Корзина пуста</h1>
          <p className="mb-6 text-corporate-gray">
            Загляните в каталог — там есть проверенная техника и золото.
          </p>
          <Link href="/catalog">
            <Button>Перейти в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-corporate-bg py-12">
      <div className="container-corp grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="mb-6">Корзина</h1>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-card border border-corporate-border bg-white p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-corp bg-corporate-bg">
                  <ProductImage
                    productId={item.productId}
                    fallbackUrl={item.image ?? ''}
                    alt={item.title}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 truncate font-semibold">{item.title}</div>
                  <div className="text-lg font-bold text-primary">
                    {formatRub(item.price)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  aria-label="Удалить из корзины"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-corporate-gray hover:bg-corporate-bg hover:text-danger"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-10 text-xl font-semibold">Способ получения</h2>
          <div className="space-y-3">
            {deliveryOptions.map((opt) => {
              const active = delivery === opt.id;
              const Icon = opt.icon;
              return (
                <label
                  key={opt.id}
                  className={cn(
                    'flex cursor-pointer gap-4 rounded-card border bg-white p-5 transition-colors',
                    active
                      ? 'border-gold ring-2 ring-gold/20'
                      : 'border-corporate-border hover:border-gold/50'
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={active}
                    onChange={() => setDelivery(opt.id)}
                    className="sr-only"
                  />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-semibold">{opt.title}</div>
                      <div className="text-sm font-semibold text-corporate-gray">
                        {opt.price}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-corporate-gray">
                      {opt.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-card border border-corporate-border bg-white p-6"
          >
            <h2 className="text-xl font-semibold">Оформление</h2>

            <div className="flex justify-between text-sm">
              <span className="text-corporate-gray">
                Товары ({items.length})
              </span>
              <span className="font-semibold">{formatRub(total)}</span>
            </div>
            <div className="flex justify-between border-t border-corporate-border pt-3 text-base font-bold">
              <span>Итого к оплате</span>
              <span className="text-primary">{formatRub(total)}</span>
            </div>

            <Input
              label="Как к вам обращаться?"
              placeholder="Иван"
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">Телефон</label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <IMaskInput
                    mask="+7 (000) 000-00-00"
                    value={field.value ?? ''}
                    onAccept={(val: string) => field.onChange(val)}
                    onBlur={field.onBlur}
                    placeholder="+7 (999) 000-00-00"
                    className={cn(
                      'h-12 w-full rounded-corp border bg-white px-4 text-base outline-none',
                      'border-corporate-border focus:border-gold focus:ring-2 focus:ring-gold/20',
                      errors.phone && 'border-danger bg-red-50'
                    )}
                  />
                )}
              />
              <p className="mt-1 min-h-[1.25rem] text-sm text-danger">
                {errors.phone?.message ?? ''}
              </p>
            </div>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              {...register('website')}
            />

            <label className="flex items-start gap-3 text-sm text-corporate-gray">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-gold"
                {...register('gdpr')}
              />
              <span>
                Согласен с{' '}
                <Link href="/offer" className="text-gold hover:underline" target="_blank">
                  публичной офертой
                </Link>
                {' '}и обработкой персональных данных.
              </span>
            </label>
            {errors.gdpr && (
              <p className="-mt-2 text-sm text-danger">{errors.gdpr.message}</p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Создаём заказ…' : `Оплатить ${formatRub(total)}`}
            </Button>

            <p className="text-center text-xs text-corporate-muted">
              Оплата картой через ЮKassa.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}
