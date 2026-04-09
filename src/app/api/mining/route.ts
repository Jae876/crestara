import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { MiningBotPurchaseSchema } from '@crestara/shared';

const PACKAGES: Record<string, { price: number; dailyRate: number; days: number; description: string }> = {
  BASIC: { price: 5,  dailyRate: 0.50, days: 90,  description: 'Entry-level bot. BTC, LTC, DOGE support.' },
  PRO:   { price: 10, dailyRate: 1.00, days: 120, description: 'Pro bot. All 6 coins. Coin-switching AI.' },
};

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const bots = await prisma.miningBot.findMany({
      where: { userId: auth.sub },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      packages: Object.entries(PACKAGES).map(([type, pkg]) => ({ type, ...pkg })),
      activeBots: bots,
    });
  } catch {
    return NextResponse.json({
      packages: Object.entries(PACKAGES).map(([type, pkg]) => ({ type, ...pkg })),
      activeBots: [],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const validated = MiningBotPurchaseSchema.parse(body);

    const pkg = PACKAGES[validated.packageType];
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: auth.sub } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.balanceUSD < pkg.price) {
      return NextResponse.json({ error: `Insufficient balance. Need $${pkg.price}, have $${user.balanceUSD.toFixed(2)}` }, { status: 400 });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + pkg.days);

    const [bot] = await prisma.$transaction([
      prisma.miningBot.create({
        data: {
          userId: auth.sub,
          packageType: validated.packageType as any,
          coin: validated.coin as any,
          endDate,
          dailyRate: pkg.dailyRate,
          totalMined: 0,
        },
      }),
      prisma.user.update({
        where: { id: auth.sub },
        data: { balanceUSD: { decrement: pkg.price } },
      }),
      prisma.transaction.create({
        data: {
          userId: auth.sub,
          type: 'DEPOSIT',
          status: 'CONFIRMED',
          coinSymbol: 'USD',
          amount: pkg.price,
          amountUSD: pkg.price,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Mining bot activated', bot }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 422 });
    }
    return NextResponse.json({ error: error.message || 'Failed to purchase mining bot' }, { status: 500 });
  }
}
