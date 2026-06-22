// middleware.js  (place at the ROOT of your project)
// Protects content pages — redirects unauthenticated users to the login page

import { NextResponse } from 'next/server';

// Pages that require login
const PROTECTED = [
  '/youtube-automation.html',
  '/youtube-prompts.html',
  '/youtube-resources.html',
  '/facebook-automation.html',
  '/whop-clipping.html',
  '/content-essentials.html',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const cookie = request.cookies.get('vv_session');

  if (!cookie) {
    // Not logged in — redirect to home with a flag to open the login modal
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', '1');
    return NextResponse.redirect(url);
  }

  try {
    const session = JSON.parse(
      Buffer.from(cookie.value, 'base64').toString('utf8')
    );
    if (session.exp < Date.now()) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', '1');
      return NextResponse.redirect(url);
    }
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', '1');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/youtube-automation.html',
    '/youtube-prompts.html',
    '/youtube-resources.html',
    '/facebook-automation.html',
    '/whop-clipping.html',
    '/content-essentials.html',
  ],
};
