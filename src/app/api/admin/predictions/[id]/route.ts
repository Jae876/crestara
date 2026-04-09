import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

function adminAuth(request: NextRequest) {
  const token = extractToken(request);
  const auth = verifyToken(token);
  requireAdmin(auth);
  return auth;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    adminAuth(request);
    const prediction = await predictionsService.getPrediction(params.id);
    return NextResponse.json({ prediction });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 404;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    adminAuth(request);
    const body = await request.json();
    const { action, ...rest } = body;

    if (action === 'open') {
      const p = await predictionsService.openPrediction(params.id);
      return NextResponse.json({ prediction: p });
    }
    if (action === 'suspend') {
      const p = await predictionsService.suspendPrediction(params.id);
      return NextResponse.json({ prediction: p });
    }
    if (action === 'cancel') {
      const p = await predictionsService.cancelPrediction(params.id);
      return NextResponse.json({ prediction: p });
    }
    if (action === 'resolve') {
      const { winningOptionId } = rest;
      if (!winningOptionId) return NextResponse.json({ error: 'winningOptionId is required' }, { status: 400 });
      const p = await predictionsService.resolvePrediction(params.id, winningOptionId);
      return NextResponse.json({ prediction: p });
    }

    const updated = await predictionsService.updatePrediction(params.id, rest);
    return NextResponse.json({ prediction: updated });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
