import { NextResponse, type NextRequest } from 'next/server';
import { signSession } from '@/lib/admin-auth';

const ADMIN_COOKIE = 'admin_session';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;

  // Без заданного пароля вход в админку закрыт — никаких дефолтов.
  if (!password) {
    return NextResponse.json(
      { error: 'Админка не сконфигурирована: задайте ADMIN_PASSWORD' },
      { status: 503 }
    );
  }

  if (!body || body.username !== username || body.password !== password) {
    return NextResponse.json(
      { error: 'Неверный логин или пароль' },
      { status: 401 }
    );
  }

  const token = await signSession();
  if (!token) {
    return NextResponse.json(
      { error: 'Сессия не сконфигурирована' },
      { status: 503 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: ADMIN_COOKIE, value: '', maxAge: 0, path: '/' });
  return res;
}
