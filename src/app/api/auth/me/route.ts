import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { extractToken } from '@/lib/auth-middleware';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const user = await authService.getCurrentUser(token);
    
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }
}
