import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Route /api/* requests to backend (which runs on 3001 internally)
  if (pathname.startsWith('/api')) {
    const backendUrl = new URL(pathname, process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    backendUrl.search = request.nextUrl.search;
    
    return NextResponse.rewrite(backendUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
