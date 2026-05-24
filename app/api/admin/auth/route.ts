import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'demo123';

  if (!body || body.username !== username || body.password !== password) {
    return NextResponse.json(
      { error: 'Неверный логин или пароль' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: password,
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
