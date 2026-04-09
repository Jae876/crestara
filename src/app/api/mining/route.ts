import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';

const PACKAGES: Record<string, { price: number; dailyRate: number; days: number; description: string }> = {
  STARTER:  { price: 10,   dailyRate: 0.50,  days: 90,  description: 'Entry-level bot. BTC, LTC, DOGE support.' },
  BASIC:    { price: 50,   dailyRate: 2.50,  days: 90,  description: 'Basic bot. 4 coins. Daily auto-credit.' },
  STANDARD: { price: 100,  dailyRate: 5.00,  days: 120, description: 'Standard bot. 5 coins. AI coin-switching.' },
  ADVANCED: { price: 250,  dailyRate: 12.50, days: 150, description: 'Advanced bot. All 6 coins. VIP manager.' },
  ELITE:    { price: 500,  dailyRate: 25.00, days: 180, description: 'Elite bot. Max hashrate. Full AI suite.' },
  DIAMOND:  { price: 1000, dailyRate: 55.00, days: 365, description: 'Diamond bot. Institutional tier. Private group. Daily $55.' },
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
    const { packageType, coin } = body;

    if (!packageType || !coin) {
      return NextResponse.json({ error: 'packageType and coin are required' }, { status: 400 });
    }

    const pkg = PACKAGES[packageType];
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

    // Map custom package types to DB enum values
    const dbPackageType = (() => {
      if (['STARTER', 'BASIC'].includes(packageType)) return 'BASIC';
      if (['STANDARD'].includes(packageType)) return 'PRO';
      return 'ELITE'; // ADVANCED, ELITE, DIAMOND
    })();

    const [bot] = await prisma.$transaction([
      prisma.miningBot.create({
        data: {
          userId: auth.sub,
          packageType: dbPackageType as any,
          coin: coin as any,
          endDate,
          dailyRate: pkg.dailyRate,
          totalMined: 0,
          status: 'ACTIVE',
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
          metadata: { packageType, packageLabel: packageType, coin },
        },
      }),
    ]);

    return NextResponse.json({ message: 'Mining bot activated', bot }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to purchase mining bot' }, { status: 500 });
  }
}
