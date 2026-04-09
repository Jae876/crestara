import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';
import { PredictionStatus, PredictionCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PredictionStatus | null;
    const category = searchParams.get('category') as PredictionCategory | null;

    const predictions = await predictionsService.listPredictions(
      status || PredictionStatus.OPEN,
      category || undefined,
    );

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
    return NextResponse.json({ error: error.message || 'Failed to fetch predictions' }, { status: 500 });
  }
}
