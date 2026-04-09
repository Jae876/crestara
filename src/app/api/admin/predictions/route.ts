import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';
import { PredictionStatus, PredictionCategory } from '@prisma/client';

function adminAuth(request: NextRequest) {
  const token = extractToken(request);
  const auth = verifyToken(token);
  requireAdmin(auth);
  return auth;
}

export async function GET(request: NextRequest) {
  try {
    adminAuth(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PredictionStatus | null;
    const category = searchParams.get('category') as PredictionCategory | null;

    const predictions = await predictionsService.listPredictions(status || undefined, category || undefined);

    const enriched = await Promise.all(
      predictions.map(async (p) => {
        const poolAgg = await import('@/lib/db').then((m) =>
          m.default.predictionBet.aggregate({
            where: { predictionId: p.id },
            _sum: { amount: true },
          }),
        );
        return { ...p, totalPool: (poolAgg._sum?.amount) || 0 };
      }),
    );

    return NextResponse.json({ predictions: enriched });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    adminAuth(request);
    const body = await request.json();
    const { title, description, category, imageUrl, bettingStartsAt, bettingEndsAt, options } = body;

    if (!title || !description || !bettingStartsAt || !bettingEndsAt || !options?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prediction = await predictionsService.createPrediction({
      title,
      description,
      category: category || PredictionCategory.OTHER,
      imageUrl,
      bettingStartsAt: new Date(bettingStartsAt),
      bettingEndsAt: new Date(bettingEndsAt),
      options,
    });

    return NextResponse.json({ prediction }, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
