import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const bets = await predictionsService.getPredictionBets(params.id);
    return NextResponse.json({ bets });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
