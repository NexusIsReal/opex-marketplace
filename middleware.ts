import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is intentionally empty to avoid conflicts with static file serving
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Only run middleware on auth paths
export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
  ],
};
