import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';
import { virtualSportsService } from '@/lib/services/virtual-sports.service';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'sports';

    if (action === 'sports') {
      const sports = await virtualSportsService.getAllSports();
      return NextResponse.json({ sports });
    }

    if (action === 'bets') {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
      const eventId = searchParams.get('eventId') || undefined;
      const search = searchParams.get('search') || undefined;
      const result = await virtualSportsService.getAllBets(page, pageSize, { eventId, search });
      return NextResponse.json(result);
    }

    if (action === 'events') {
      const events = await virtualSportsService.getUpcomingEvents(undefined, 50);
      return NextResponse.json({ events });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    const status = error.message === 'Admin access required' ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const body = await request.json();
    const { action, sportType, isEnabled, minBet, maxBet, oddsConfig, eventId } = body;

    if (action === 'resolve_event') {
      if (!eventId) {
        return NextResponse.json({ error: 'eventId required' }, { status: 400 });
      }
      await virtualSportsService.manuallyResolveEvent(eventId);
      return NextResponse.json({ message: 'Event resolved successfully' });
    }

    if (!sportType) {
      return NextResponse.json({ error: 'sportType required' }, { status: 400 });
    }

    const updates: { isEnabled?: boolean; minBet?: number; maxBet?: number; oddsConfig?: Record<string, number> } = {};
    if (isEnabled !== undefined) updates.isEnabled = isEnabled;
    if (minBet !== undefined) updates.minBet = minBet;
    if (maxBet !== undefined) updates.maxBet = maxBet;
    if (oddsConfig !== undefined) updates.oddsConfig = oddsConfig;

    const sport = await virtualSportsService.updateSportConfig(sportType, updates);
    return NextResponse.json({ sport });
  } catch (error: any) {
    const status = error.message === 'Admin access required' ? 403
      : error.message?.includes('not found') ? 404
      : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
