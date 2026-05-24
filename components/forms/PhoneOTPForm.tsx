'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { IMaskInput } from 'react-imask';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { normalizePhone, cn } from '@/lib/utils';

export function PhoneOTPForm() {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    const supabase = createSupabaseBrowserClient();
    const normalized = normalizePhone(phone);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Код отправлен в SMS');
    setStep('code');
  }

  async function verify() {
    const supabase = createSupabaseBrowserClient();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Вход выполнен');
    window.location.href = '/profile';
  }

  return (
    <div className="mx-auto max-w-md rounded-card border border-corporate-border bg-white p-8 shadow-card-rest">
      <h2 className="mb-2 text-center">Вход</h2>
      <p className="mb-6 text-center text-sm text-corporate-gray">
        {step === 'phone'
          ? 'Введите номер — пришлём SMS с кодом'
          : `Код отправлен на ${phone}`}
      </p>

      {step === 'phone' ? (
        <div className="space-y-4">
          <IMaskInput
            mask="+7 (000) 000-00-00"
            value={phone}
            onAccept={(v: string) => setPhone(v)}
            placeholder="+7 (999) 000-00-00"
            className={cn(
              'h-12 w-full rounded-corp border border-corporate-border bg-white px-4 text-base outline-none',
              'focus:border-gold focus:ring-2 focus:ring-gold/20'
            )}
          />
          <Button
            type="button"
            className="w-full"
            disabled={loading || phone.length < 10}
            onClick={sendOtp}
          >
            {loading ? 'Отправляем...' : 'Получить код'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Код из SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          <Button type="button" className="w-full" disabled={loading} onClick={verify}>
            {loading ? 'Проверяем...' : 'Войти'}
          </Button>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-sm text-corporate-gray hover:text-gold"
          >
            ← Изменить номер
          </button>
        </div>
      )}
    </div>
  );
}
