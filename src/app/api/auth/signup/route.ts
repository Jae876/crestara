import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { SignUpSchema } from '@crestara/shared';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SignUpSchema.parse(body);
    
    const result = await authService.signUp(validated);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes('already registered') ? 400 : 500;
    return NextResponse.json(
      { error: error.message || 'Sign up failed' },
      { status },
    );
  }
}
