'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';

function safeReturn(raw: string | null): string {
  if (!raw) return '/admin';
  if (raw.startsWith('/admin') && !raw.startsWith('//')) return raw;
  return '/admin';
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturn(searchParams.get('return'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? 'Ошибка авторизации');
        return;
      }
      router.replace(returnTo);
      router.refresh();
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-sm space-y-4 rounded-card border border-corporate-border bg-white p-8 shadow-card-rest"
    >
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold-dark">
        <Lock size={22} />
      </div>
      <h1 className="text-center text-2xl">Вход в админ-панель</h1>
      <p className="text-center text-sm text-corporate-gray">
        Тестовая учётка для демо: <code>admin</code> / <code>demo123</code>
      </p>
      <Input
        label="Логин"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="admin"
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Проверяем…' : 'Войти'}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="bg-corporate-bg py-16">
      <Suspense
        fallback={
          <div className="mx-auto h-72 max-w-sm animate-pulse rounded-card bg-white" />
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
