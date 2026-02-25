import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Next.js 14 handles all API routes natively through app router
  // No middleware proxying needed - routes are in /src/app/api/*
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
