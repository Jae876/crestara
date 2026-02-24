import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';
import { LoginSchema } from '@crestara/shared';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);
    
    const authService = new AuthService(prisma);
    const result = await authService.login(validated);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 },
    );
  }
}
