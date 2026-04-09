import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const wheelSpins = await prisma.wheelSpin.findMany({
      where: { userId: auth.sub },
      orderBy: { createdAt: 'desc' },
    });

    const totalAvailable = wheelSpins.reduce(
      (sum, ws) => sum + (ws.spinsAllocated - ws.spinsUsed),
      0,
    );

    return NextResponse.json({ wheelSpins, totalAvailable });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }
}
