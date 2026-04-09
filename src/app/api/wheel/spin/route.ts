import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';

const WHEEL_SEGMENTS = [
  '$500 Jackpot!',
  '50 Free Spins',
  '2x Bonus',
  '$250 Prize',
  '100 Free Spins',
  '5x Multiplier',
  '$1,000 Jackpot!',
  '25 Free Spins',
  '3x Bonus',
  '$100 Prize',
  '200 Free Spins',
  '10x Multiplier',
];

function computePrize(depositAmount: number): { label: string; amount: number } {
  const label = WHEEL_SEGMENTS[Math.floor(Math.random() * WHEEL_SEGMENTS.length)];
  const capAmount = depositAmount > 0 ? depositAmount * 0.03 : 0.25;
  const minAmount = depositAmount > 0 ? Math.max(0.01, depositAmount * 0.005) : 0.10;
  const amount = Math.round((minAmount + Math.random() * (capAmount - minAmount)) * 100) / 100;
  return { label, amount };
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const { wheelSpinId } = body;

    if (!wheelSpinId) {
      return NextResponse.json({ error: 'wheelSpinId is required' }, { status: 400 });
    }

    const wheelSpin = await prisma.wheelSpin.findUnique({
      where: { id: wheelSpinId },
    });

    if (!wheelSpin) {
      return NextResponse.json({ error: 'Spin record not found' }, { status: 404 });
    }

    if (wheelSpin.userId !== auth.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { label, amount } = computePrize(wheelSpin.depositAmount);

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.wheelSpin.updateMany({
        where: {
          id: wheelSpinId,
          userId: auth.sub,
          spinsUsed: { lt: wheelSpin.spinsAllocated },
        },
        data: { spinsUsed: { increment: 1 } },
      });

      if (updated.count === 0) {
        return null;
      }

      await tx.wheelSpinResult.create({
        data: {
          wheelSpinId,
          prizeLabel: label,
          prizeAmount: amount,
        },
      });

      await tx.user.update({
        where: { id: auth.sub },
        data: { balanceUSD: { increment: amount } },
      });

      return { prizeLabel: label, prizeAmount: amount };
    });

    if (!result) {
      return NextResponse.json({ error: 'No spins remaining' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    const msg: string = error?.message || '';
    if (msg === 'Unauthorized' || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Spin failed' },
      { status: 500 },
    );
  }
}
