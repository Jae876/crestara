import { NextRequest, NextResponse } from 'next/server';
import { virtualSportsService } from '@/lib/services/virtual-sports.service';

export async function GET(request: NextRequest) {
  try {
    await virtualSportsService.generateUpcomingEvents();
    await virtualSportsService.resolveExpiredEvents();

    const { searchParams } = new URL(request.url);
    const sportType = searchParams.get('sport') || undefined;

    const [sports, events, recent] = await Promise.all([
      virtualSportsService.getAllSports(),
      virtualSportsService.getUpcomingEvents(sportType),
      virtualSportsService.getRecentResults(sportType, 10),
    ]);

    return NextResponse.json({ sports, events, recent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
