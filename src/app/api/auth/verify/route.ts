import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 },
      );
    }
    
    const authService = new AuthService();
    const payload = await authService.verifyToken(token);
    
    return NextResponse.json({ valid: true, payload }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message || 'Invalid token' },
      { status: 401 },
    );
  }
}
