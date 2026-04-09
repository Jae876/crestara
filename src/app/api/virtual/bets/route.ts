import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth-middleware';
import { virtualSportsService } from '@/lib/services/virtual-sports.service';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const result = await virtualSportsService.getUserBetHistory(auth.sub, page, pageSize);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const { eventId, marketId, selection, betAmount } = body;

    if (!eventId || !marketId || !selection || !betAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof betAmount !== 'number' || betAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    const bet = await virtualSportsService.placeBet(
      auth.sub,
      eventId,
      marketId,
      selection,
      betAmount,
    );

    return NextResponse.json({ message: 'Bet placed successfully', bet }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Insufficient balance' ? 400
      : error.message?.includes('not found') ? 404
      : error.message?.includes('no longer') || error.message?.includes('closed') ? 409
      : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
