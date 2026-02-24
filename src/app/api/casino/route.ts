import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { PlaceBetSchema } from '@crestara/shared';

export async function GET(request: NextRequest) {
  try {
    const games = await prisma.gameConfig.findMany({
      where: { isEnabled: true },
    });

    return NextResponse.json({
      message: 'Available casino games',
      games,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch games' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const validated = PlaceBetSchema.parse(body);

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
    });

    if (!user || user.balanceUSD < validated.betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 },
      );
    }

    // Create bet record
    const bet = await prisma.bet.create({
      data: {
        userId: auth.sub,
        gameType: validated.gameType as any,
        betAmount: validated.betAmount,
        multiplier: validated.multiplier || 1,
        outcome: 'PENDING',
      },
    });

    // Deduct bet from balance
    await prisma.user.update({
      where: { id: auth.sub },
      data: { balanceUSD: { decrement: validated.betAmount } },
    });

    return NextResponse.json(
      { message: 'Bet placed', bet },
      { status: 201 },
    );
  } catch (error: any) {
    const status = error.message?.includes('Zod') ? 400 : 401;
    return NextResponse.json(
      { error: error.message || 'Failed to place bet' },
      { status },
    );
  }
}
