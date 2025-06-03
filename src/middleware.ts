import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/aboutMe', '/contact', '/skills', '/lab'];

function isPublicRoute(pathname: string) {
  // Excepción: /admin no es público
  if (pathname.startsWith('/admin')) return false;
  return PUBLIC_ROUTES.some(prefix =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value ?? request.headers.get('authorization')?.replace('Bearer ', '');

  if (isPublicRoute(pathname) && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/',
    '/aboutMe',
    '/contact',
    '/skills',
    '/lab/:path*',
  ],
};
