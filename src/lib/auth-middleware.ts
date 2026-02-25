import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export interface AuthPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}

/**
 * Extract and verify JWT token from request headers
 * @throws Error if token is invalid or missing
 */
export function extractToken(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  return authHeader.substring(7);
}

/**
 * Verify JWT token and extract payload
 * @throws Error if token is invalid
 */
export function verifyToken(token: string): AuthPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Check if user has ADMIN role
 * @throws Error if user is not admin
 */
export function requireAdmin(payload: AuthPayload): void {
  if (payload.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
}

/**
 * Middleware wrapper for authenticated API routes
 */
export async function withAuth(
  handler: (req: NextRequest, auth: AuthPayload) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    try {
      const token = extractToken(request);
      const auth = verifyToken(token);
      
      return await handler(request, auth);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 },
      );
    }
  };
}

/**
 * Middleware wrapper for admin-only API routes
 */
export async function withAdminAuth(
  handler: (req: NextRequest, auth: AuthPayload) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    try {
      const token = extractToken(request);
      const auth = verifyToken(token);
      
      requireAdmin(auth);
      
      return await handler(request, auth);
    } catch (error: any) {
      const status = error.message === 'Admin access required' ? 403 : 401;
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status },
      );
    }
  };
}
