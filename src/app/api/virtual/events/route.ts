import { NextRequest, NextResponse } from 'next/server';
import { virtualSportsService } from '@/lib/services/virtual-sports.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sportType = searchParams.get('sport') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    await virtualSportsService.resolveExpiredEvents();
    await virtualSportsService.generateUpcomingEvents();

    const events = await virtualSportsService.getUpcomingEvents(sportType, limit);
    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
