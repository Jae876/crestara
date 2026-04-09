import { NextRequest, NextResponse } from 'next/server';
import { predictionsService } from '@/lib/services/predictions.service';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const prediction = await predictionsService.getPrediction(params.id);
    return NextResponse.json({ prediction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Not found' }, { status: 404 });
  }
}
