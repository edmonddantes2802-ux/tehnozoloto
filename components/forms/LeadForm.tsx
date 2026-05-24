'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';
import { leadSchema, type LeadInput } from '@/lib/validators';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { normalizePhone, cn } from '@/lib/utils';
import type { LeadCategory } from '@/types';

interface Props {
  category: LeadCategory;
  estimatedValue: number;
  details: Record<string, unknown>;
}

export function LeadForm({ category, estimatedValue, details }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      category,
      estimated_value: estimatedValue,
      gdpr: false as unknown as true,
      website: '',
    },
  });

  async function onSubmit(data: LeadInput) {
    const payload = {
      ...data,
      phone: normalizePhone(data.phone),
      category,
      estimated_value: estimatedValue,
      details,
    };

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        localStorage.setItem('pending_lead', JSON.stringify(payload));
        toast.info('Нет интернета — отправим заявку при восстановлении связи.');
        window.addEventListener(
          'online',
          () => {
            const pending = localStorage.getItem('pending_lead');
            if (pending) {
              fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: pending,
              }).then(() => localStorage.removeItem('pending_lead'));
            }
          },
          { once: true }
        );
        setSubmitted(true);
        return;
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      toast.success('Заявка принята! Менеджер перезвонит в течение 10 минут.');
      setSubmitted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Неизвестная ошибка';
      toast.error(`Не удалось отправить: ${msg}`);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-semibold text-corporate-dark">
          Спасибо! Заявка принята.
        </h3>
        <p className="text-sm text-corporate-gray">
          Менеджер свяжется с вами в течение 10 минут. А пока — посмотрите наш{' '}
          <a href="/catalog" className="font-semibold text-gold hover:underline">
            каталог со скидками
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <Input
        label="Как к вам обращаться?"
        placeholder="Иван"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <div className="w-full">
        <label className="mb-2 block text-sm font-medium">Телефон</label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <IMaskInput
              mask="+7 (000) 000-00-00"
              value={field.value ?? ''}
              onAccept={(val: string) => field.onChange(normalizePhone(val))}
              placeholder="+7 (999) 000-00-00"
              className={cn(
                'h-12 w-full rounded-corp border bg-white px-4 text-base outline-none',
                'border-corporate-border focus:border-gold focus:ring-2 focus:ring-gold/20',
                errors.phone && 'border-danger bg-red-50'
              )}
            />
          )}
        />
        {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone.message}</p>}
      </div>

      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...register('website')}
      />

      <label className="md:col-span-2 flex items-start gap-3 text-sm text-corporate-gray">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-gold"
          {...register('gdpr')}
        />
        <span>
          Соглашаюсь на обработку персональных данных в соответствии с{' '}
          <a href="#" className="text-gold hover:underline">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>
      {errors.gdpr && (
        <p className="md:col-span-2 -mt-2 text-sm text-danger">{errors.gdpr.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="md:col-span-2"
      >
        {isSubmitting ? 'Отправляем...' : 'Получить деньги →'}
      </Button>
    </form>
  );
}
