import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { MiningBotPurchaseSchema } from '@crestara/shared';

const MINING_PACKAGE_PRICES: Record<string, number> = {
  BASIC: 19.99,
  PRO: 99.99,
  ELITE: 499.99,
};

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    // Get user's active mining bots
    const bots = await prisma.miningBot.findMany({
      where: {
        userId: auth.sub,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      message: 'Mining packages',
      packages: [
        { type: 'BASIC', price: MINING_PACKAGE_PRICES.BASIC, dailyRate: 0.50 },
        { type: 'PRO', price: MINING_PACKAGE_PRICES.PRO, dailyRate: 3.00 },
        { type: 'ELITE', price: MINING_PACKAGE_PRICES.ELITE, dailyRate: 20.00 },
      ],
      activeBots: bots,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch mining packages' },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const validated = MiningBotPurchaseSchema.parse(body);

    const price = MINING_PACKAGE_PRICES[validated.packageType];
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 },
      );
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
    });

    if (!user || user.balanceUSD < price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 },
      );
    }

    // Create mining bot
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 365); // 1 year contract

    const bot = await prisma.miningBot.create({
      data: {
        userId: auth.sub,
        packageType: validated.packageType as any,
        coin: validated.coin as any,
        endDate,
        dailyRate: MINING_PACKAGE_PRICES[validated.packageType] / 365, // Simplistic rate
      },
    });

    // Deduct payment
    await prisma.user.update({
      where: { id: auth.sub },
      data: { balanceUSD: { decrement: price } },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: auth.sub,
        type: 'DEPOSIT',
        status: 'CONFIRMED',
        coinSymbol: validated.coin,
        amount: price,
        amountUSD: price,
      },
    });

    return NextResponse.json(
      { message: 'Mining bot activated', bot },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to purchase mining bot' },
      { status: 400 },
    );
  }
}
