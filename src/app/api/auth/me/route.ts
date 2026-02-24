import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/services/auth.service';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }
    
    const token = authHeader.substring(7);
    const authService = new AuthService(prisma);
    const user = await authService.getCurrentUser(token);
    
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 401 },
    );
  }
}
