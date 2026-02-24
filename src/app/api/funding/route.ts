import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { DepositInitiateSchema } from '@crestara/shared';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    // Get user's transaction history
    const transactions = await prisma.transaction.findMany({
      where: { userId: auth.sub },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      message: 'Funding methods',
      methods: ['bank_transfer', 'crypto', 'payment_gateway'],
      recentTransactions: transactions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const validated = DepositInitiateSchema.parse(body);

    // Create pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: auth.sub,
        type: 'DEPOSIT',
        status: 'PENDING',
        coinSymbol: validated.coin,
        amount: validated.amount,
        amountUSD: validated.amount * 50, // Placeholder rate
        depositAddress: `${validated.coin}_ADDRESS_${Math.random().toString(36).substring(7)}`,
      },
    });

    return NextResponse.json(
      { message: 'Deposit initiated', transaction },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initiate deposit' },
      { status: 400 },
    );
  }
}
