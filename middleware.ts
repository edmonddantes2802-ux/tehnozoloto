import { NextResponse, type NextRequest } from 'next/server';
import { verifySession } from '@/lib/admin-auth';

const ADMIN_COOKIE = 'admin_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Гард для UI-страниц админки
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const ok = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) {
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
    const ok = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
