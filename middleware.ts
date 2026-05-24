import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Гард для UI-страниц админки
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = req.cookies.get(ADMIN_COOKIE);
    const expected = process.env.ADMIN_PASSWORD ?? 'demo123';
    if (!session || session.value !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('return', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Гард для API админки (кроме /api/admin/auth — он сам разрешает вход)
  if (
    pathname.startsWith('/api/admin/') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const session = req.cookies.get(ADMIN_COOKIE);
    const expected = process.env.ADMIN_PASSWORD ?? 'demo123';
    if (!session || session.value !== expected) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
