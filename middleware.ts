import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
