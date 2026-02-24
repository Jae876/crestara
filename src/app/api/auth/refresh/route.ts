import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 },
      );
    }
    
    const authService = new AuthService();
    const result = await authService.refreshToken(refreshToken);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Token refresh failed' },
      { status: 401 },
    );
  }
}
