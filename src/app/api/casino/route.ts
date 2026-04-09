import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { PlaceBetSchema } from '@crestara/shared';
import { resolveOutcome } from '@/lib/services/outcome-resolver';

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

    const priorSettledBetCount = await prisma.bet.count({
      where: {
        userId: auth.sub,
        outcome: { in: ['WIN', 'LOSS'] },
      },
    });

    const effectiveMultiplier = Math.max(validated.multiplier || 1, 2);
    const { outcome, payout, serverSeed, clientSeed, hash } = resolveOutcome(
      priorSettledBetCount,
      validated.betAmount,
      effectiveMultiplier,
    );

    let bet;
    try {
      bet = await prisma.$transaction(async (tx) => {
        const deducted = await tx.user.updateMany({
          where: {
            id: auth.sub,
            balanceUSD: { gte: validated.betAmount },
          },
          data: { balanceUSD: { decrement: validated.betAmount } },
        });

        if (deducted.count === 0) {
          throw new Error('INSUFFICIENT_BALANCE');
        }

        const newBet = await tx.bet.create({
          data: {
            userId: auth.sub,
            gameType: validated.gameType as any,
            betAmount: validated.betAmount,
            multiplier: effectiveMultiplier,
            outcome,
            payout,
            serverSeed,
            clientSeed,
            hash,
          },
        });

        if (outcome === 'WIN') {
          await tx.user.update({
            where: { id: auth.sub },
            data: { balanceUSD: { increment: payout } },
          });

          await tx.transaction.create({
            data: {
              userId: auth.sub,
              type: 'GAME_PAYOUT',
              status: 'CONFIRMED',
              coinSymbol: 'USDT',
              amount: payout,
              amountUSD: payout,
              metadata: { betId: newBet.id, gameType: validated.gameType },
            },
          });
        }

        return newBet;
      });
    } catch (txError: any) {
      if (txError.message === 'INSUFFICIENT_BALANCE') {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 },
        );
      }
      throw txError;
    }

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
