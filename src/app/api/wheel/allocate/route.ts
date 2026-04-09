import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

function getSpinCount(amountUSD: number): number {
  if (amountUSD >= 10 && amountUSD < 50) return 1;
  if (amountUSD >= 50) return 2;
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const body = await request.json();
    const { userId, depositId, amountUSD } = body;

    if (!userId || !depositId || amountUSD === undefined) {
      return NextResponse.json(
        { error: 'userId, depositId, and amountUSD are required' },
        { status: 400 },
      );
    }

    const spinsAllocated = getSpinCount(amountUSD);
    if (spinsAllocated === 0) {
      return NextResponse.json(
        { message: 'Deposit below minimum threshold — no spins allocated', spinsAllocated: 0 },
      );
    }

    const existing = await prisma.wheelSpin.findFirst({
      where: { userId, depositId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Spins already allocated for this deposit' },
        { status: 409 },
      );
    }

    const wheelSpin = await prisma.wheelSpin.create({
      data: {
        userId,
        depositId,
        spinsAllocated,
        depositAmount: amountUSD,
      },
    });

    return NextResponse.json({ wheelSpin, spinsAllocated });
  } catch (error: any) {
    const msg: string = error?.message || '';
    if (msg === 'Admin access required') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('authorization') || msg === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Allocation failed' },
      { status: 500 },
    );
  }
}
