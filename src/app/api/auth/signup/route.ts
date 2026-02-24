import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';
import { SignUpSchema } from '@crestara/shared';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = SignUpSchema.parse(body);
    
    const authService = new AuthService(prisma);
    const result = await authService.signUp(validated);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sign up failed' },
      { status: 400 },
    );
  }
}
