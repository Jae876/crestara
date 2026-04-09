import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';
import { extractToken, verifyToken } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const { predictionId, optionId, amount } = body;

    if (!predictionId || !optionId || !amount) {
      return NextResponse.json({ error: 'predictionId, optionId, and amount are required' }, { status: 400 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    const bet = await predictionsService.placeBet(auth.sub, predictionId, optionId, numericAmount);
    return NextResponse.json({ message: 'Bet placed successfully', bet }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Insufficient balance' ? 400 : error.message?.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message || 'Failed to place bet' }, { status });
  }
}
