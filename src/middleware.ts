// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/verify-email'];

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (!isAuthRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie = cookies.has('authjs.session-token');

  if (hasSessionCookie) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
};
