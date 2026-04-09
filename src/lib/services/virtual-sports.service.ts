import crypto from 'crypto';
import prisma from '@/lib/db';

export const SPORT_POOLS: Record<string, string[]> = {
  FOOTBALL: [
    'Arsenal FC', 'Chelsea FC', 'Liverpool FC', 'Manchester City', 'Manchester United',
    'Tottenham', 'Everton', 'West Ham', 'Newcastle', 'Aston Villa',
    'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Valencia', 'Sevilla',
    'Bayern Munich', 'Borussia Dortmund', 'PSG', 'Juventus', 'AC Milan',
  ],
  BASKETBALL: [
    'Lakers', 'Celtics', 'Warriors', 'Bulls', 'Heat',
    'Nets', 'Knicks', 'Bucks', 'Suns', 'Nuggets',
    'Clippers', 'Mavericks', 'Raptors', 'Jazz', 'Spurs',
    'Rockets', 'Thunder', 'Trail Blazers', 'Pacers', 'Hawks',
  ],
  HORSE_RACING: [
    'Lightning Bolt', 'Shadow Runner', 'Silver Arrow', 'Wild Spirit', 'Golden Eagle',
    'Thunder Hooves', 'Dark Knight', 'Crimson Storm', 'Swift Wind', 'Iron Fist',
    'Desert Rose', 'Midnight Star', 'Fire Dancer', 'Blue Diamond', 'Royal Flush',
    'Lucky Charm', 'Black Pearl', 'Storm Rider', 'Sun Blaze', 'Steel Thunder',
  ],
  DOG_RACING: [
    'Rapid Rex', 'Flash Gordon', 'Turbo Tail', 'Rocket Dog', 'Speed Demon',
    'Blue Lightning', 'Sonic Boom', 'Dash King', 'Nitro Paws', 'Thunder Pup',
    'Quick Silver', 'Wind Chaser', 'Blaze Runner', 'Jet Stream', 'Power Hound',
    'Storm Chaser', 'Fire Streak', 'Swift Shadow', 'Bolt Runner', 'Ace Racer',
  ],
  TENNIS: [
    'R. Federer', 'N. Djokovic', 'R. Nadal', 'C. Alcaraz', 'A. Zverev',
    'D. Medvedev', 'S. Tsitsipas', 'H. Hurkacz', 'C. Ruud', 'A. Rublev',
    'S. Williams', 'I. Swiatek', 'A. Barty', 'S. Halep', 'G. Muguruza',
    'C. Wozniacki', 'V. Azarenka', 'B. Bencic', 'A. Kerber', 'N. Osaka',
  ],
  MOTOR_RACING: [
    'M. Hamilton', 'M. Verstappen', 'C. Leclerc', 'S. Vettel', 'F. Alonso',
    'L. Norris', 'V. Bottas', 'E. Ocon', 'D. Ricciardo', 'G. Russell',
    'S. Perez', 'A. Sainz', 'L. Stroll', 'Y. Tsunoda', 'N. Latifi',
    'P. Gasly', 'M. Schumacher', 'G. Zhou', 'K. Magnussen', 'L. Sargeant',
  ],
};

export const DEFAULT_ODDS_CONFIG: Record<string, Record<string, number>> = {
  FOOTBALL: { home_win: 2.1, draw: 3.2, away_win: 2.8 },
  BASKETBALL: { home_win: 1.85, away_win: 1.95 },
  HORSE_RACING: { p1: 4.5, p2: 3.0, p3: 2.0 },
  DOG_RACING: { p1: 5.0, p2: 3.5, p3: 2.2 },
  TENNIS: { player1_win: 1.85, player2_win: 1.95 },
  MOTOR_RACING: { p1: 4.0, p2: 3.2, p3: 2.5 },
};

function seededRng(seed: string): () => number {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  let state = BigInt('0x' + hash.slice(0, 16));
  return () => {
    state = (state * BigInt(6364136223846793005) + BigInt(1442695040888963407)) & BigInt('0xFFFFFFFFFFFFFFFF');
    return Number(state & BigInt('0xFFFFFF')) / 0xFFFFFF;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickUniqueN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

function generateEventSeed(): string {
  return crypto.randomBytes(16).toString('hex');
}

function buildMarketsForSport(
  sportType: string,
  participants: string[],
  oddsConfig: Record<string, number>,
): Array<{ name: string; options: Array<{ key: string; label: string; odds: number }> }> {
  switch (sportType) {
    case 'FOOTBALL': {
      const [home, away] = participants;
      return [{
        name: 'Match Result',
        options: [
          { key: 'home_win', label: `${home} Win`, odds: oddsConfig.home_win ?? 2.1 },
          { key: 'draw', label: 'Draw', odds: oddsConfig.draw ?? 3.2 },
          { key: 'away_win', label: `${away} Win`, odds: oddsConfig.away_win ?? 2.8 },
        ],
      }];
    }
    case 'BASKETBALL': {
      const [home, away] = participants;
      return [{
        name: 'Match Winner',
        options: [
          { key: 'home_win', label: `${home} Win`, odds: oddsConfig.home_win ?? 1.85 },
          { key: 'away_win', label: `${away} Win`, odds: oddsConfig.away_win ?? 1.95 },
        ],
      }];
    }
    case 'HORSE_RACING':
    case 'DOG_RACING': {
      return [{
        name: 'Podium Finishers',
        options: [
          { key: 'p1', label: `1st: ${participants[0]}`, odds: oddsConfig.p1 ?? 4.5 },
          { key: 'p2', label: `1st: ${participants[1]}`, odds: oddsConfig.p2 ?? 3.0 },
          { key: 'p3', label: `1st: ${participants[2]}`, odds: oddsConfig.p3 ?? 2.0 },
        ],
      }];
    }
    case 'TENNIS': {
      const [p1, p2] = participants;
      return [{
        name: 'Match Winner',
        options: [
          { key: 'player1_win', label: `${p1} Win`, odds: oddsConfig.player1_win ?? 1.85 },
          { key: 'player2_win', label: `${p2} Win`, odds: oddsConfig.player2_win ?? 1.95 },
        ],
      }];
    }
    case 'MOTOR_RACING': {
      return [{
        name: 'Race Podium',
        options: [
          { key: 'p1', label: `1st: ${participants[0]}`, odds: oddsConfig.p1 ?? 4.0 },
          { key: 'p2', label: `1st: ${participants[1]}`, odds: oddsConfig.p2 ?? 3.2 },
          { key: 'p3', label: `1st: ${participants[2]}`, odds: oddsConfig.p3 ?? 2.5 },
        ],
      }];
    }
    default:
      return [];
  }
}

function resolveOutcomeForSport(
  sportType: string,
  participants: string[],
  rng: () => number,
): { outcomeKey: string; resultDetails: Record<string, unknown> } {
  switch (sportType) {
    case 'FOOTBALL': {
      const roll = rng();
      const outcomes = ['home_win', 'draw', 'away_win'];
      const weights = [0.42, 0.28, 0.30];
      let cumulative = 0;
      let outcomeKey = 'home_win';
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (roll < cumulative) { outcomeKey = outcomes[i]; break; }
      }
      const homeGoals = Math.floor(rng() * 4);
      const awayGoals = outcomeKey === 'home_win' ? Math.floor(rng() * homeGoals) : outcomeKey === 'away_win' ? homeGoals + 1 + Math.floor(rng() * 3) : homeGoals;
      return {
        outcomeKey,
        resultDetails: { score: `${homeGoals}–${awayGoals}`, homeTeam: participants[0], awayTeam: participants[1] },
      };
    }
    case 'BASKETBALL': {
      const outcomeKey = rng() < 0.5 ? 'home_win' : 'away_win';
      const homeScore = 80 + Math.floor(rng() * 40);
      const awayScore = outcomeKey === 'home_win' ? homeScore - 1 - Math.floor(rng() * 20) : homeScore + 1 + Math.floor(rng() * 20);
      return {
        outcomeKey,
        resultDetails: { score: `${homeScore}–${awayScore}`, homeTeam: participants[0], awayTeam: participants[1] },
      };
    }
    case 'HORSE_RACING':
    case 'DOG_RACING': {
      const roll = rng();
      const outcomeKey = roll < 0.25 ? 'p1' : roll < 0.50 ? 'p2' : 'p3';
      const shuffled = pickUniqueN(participants, participants.length, rng);
      return {
        outcomeKey,
        resultDetails: { finishing_order: shuffled.slice(0, 3) },
      };
    }
    case 'TENNIS': {
      const outcomeKey = rng() < 0.5 ? 'player1_win' : 'player2_win';
      const sets = outcomeKey === 'player1_win' ? `2–${Math.floor(rng() * 2)}` : `${Math.floor(rng() * 2)}–2`;
      return {
        outcomeKey,
        resultDetails: { sets, player1: participants[0], player2: participants[1] },
      };
    }
    case 'MOTOR_RACING': {
      const roll = rng();
      const outcomeKey = roll < 0.30 ? 'p1' : roll < 0.60 ? 'p2' : 'p3';
      const shuffled = pickUniqueN(participants, participants.length, rng);
      return {
        outcomeKey,
        resultDetails: { finishing_order: shuffled.slice(0, 3) },
      };
    }
    default:
      return { outcomeKey: 'p1', resultDetails: {} };
  }
}

export class VirtualSportsService {
  async ensureSportsExist(): Promise<void> {
    const sportTypes = ['FOOTBALL', 'BASKETBALL', 'HORSE_RACING', 'DOG_RACING', 'TENNIS', 'MOTOR_RACING'] as const;
    for (const sportType of sportTypes) {
      await prisma.virtualSport.upsert({
        where: { sportType },
        update: {},
        create: {
          sportType,
          isEnabled: true,
          minBet: 0.50,
          maxBet: 1000,
          oddsConfig: DEFAULT_ODDS_CONFIG[sportType] ?? {},
        },
      });
    }
  }

  async generateUpcomingEvents(): Promise<void> {
    await this.ensureSportsExist();
    const sports = await prisma.virtualSport.findMany({ where: { isEnabled: true } });
    const now = new Date();

    for (const sport of sports) {
      const existingUpcoming = await prisma.virtualEvent.count({
        where: {
          sportId: sport.id,
          status: { in: ['UPCOMING', 'LIVE'] },
          startTime: { gt: now },
        },
      });

      const needed = 3 - existingUpcoming;
      if (needed <= 0) continue;

      const pool = SPORT_POOLS[sport.sportType] ?? [];
      const oddsConfig = (sport.oddsConfig as Record<string, number>) ?? {};

      for (let i = 0; i < needed; i++) {
        const seed = generateEventSeed();
        const rng = seededRng(seed);
        const minutesAhead = 3 + i * 3 + Math.floor(rng() * 2);
        const startTime = new Date(now.getTime() + minutesAhead * 60 * 1000);

        let participants: string[];
        switch (sport.sportType) {
          case 'FOOTBALL':
          case 'BASKETBALL':
          case 'TENNIS':
            participants = pickUniqueN(pool, 2, rng);
            break;
          case 'HORSE_RACING':
          case 'DOG_RACING':
            participants = pickUniqueN(pool, 8, rng);
            break;
          case 'MOTOR_RACING':
            participants = pickUniqueN(pool, 6, rng);
            break;
          default:
            participants = pickUniqueN(pool, 2, rng);
        }

        const markets = buildMarketsForSport(sport.sportType, participants, oddsConfig);

        await prisma.virtualEvent.create({
          data: {
            sportId: sport.id,
            sportType: sport.sportType,
            participants,
            startTime,
            status: 'UPCOMING',
            markets: {
              create: markets.map((m) => ({
                name: m.name,
                options: m.options,
                isOpen: true,
              })),
            },
          },
        });
      }
    }
  }

  async resolveExpiredEvents(): Promise<void> {
    const now = new Date();
    const liveThreshold = new Date(now.getTime() - 60 * 1000);

    await prisma.virtualEvent.updateMany({
      where: { status: 'UPCOMING', startTime: { lte: now } },
      data: { status: 'LIVE' },
    });

    const liveEvents = await prisma.virtualEvent.findMany({
      where: { status: 'LIVE', startTime: { lte: liveThreshold } },
      include: { markets: true },
    });

    for (const event of liveEvents) {
      const seed = event.id;
      const rng = seededRng(seed);
      const participants = event.participants as string[];
      const { outcomeKey, resultDetails } = resolveOutcomeForSport(event.sportType, participants, rng);

      await prisma.$transaction(async (tx) => {
        await tx.virtualEvent.update({
          where: { id: event.id },
          data: {
            status: 'SETTLED',
            outcome: outcomeKey,
            resultDetails,
            markets: { updateMany: { where: { eventId: event.id }, data: { isOpen: false } } },
          },
        });

        const pendingBets = await tx.virtualBet.findMany({
          where: { eventId: event.id, status: 'PENDING' },
        });

        for (const bet of pendingBets) {
          const won = bet.selection === outcomeKey;
          const payout = won ? bet.betAmount * bet.odds : 0;

          await tx.virtualBet.update({
            where: { id: bet.id },
            data: {
              status: won ? 'WON' : 'LOST',
              payout,
              settledAt: new Date(),
            },
          });

          if (won) {
            await tx.user.update({
              where: { id: bet.userId },
              data: { balanceUSD: { increment: payout } },
            });
          }
        }
      });

      await this.generateUpcomingEvents();
    }
  }

  async getUpcomingEvents(sportType?: string, limit = 20) {
    const where: Record<string, unknown> = {
      status: { in: ['UPCOMING', 'LIVE'] },
    };
    if (sportType) where.sportType = sportType;

    return prisma.virtualEvent.findMany({
      where,
      include: { markets: true },
      orderBy: { startTime: 'asc' },
      take: limit,
    });
  }

  async getRecentResults(sportType?: string, limit = 20) {
    const where: Record<string, unknown> = { status: 'SETTLED' };
    if (sportType) where.sportType = sportType;

    return prisma.virtualEvent.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async getEventById(eventId: string) {
    return prisma.virtualEvent.findUnique({
      where: { id: eventId },
      include: { markets: true },
    });
  }

  async placeBet(
    userId: string,
    eventId: string,
    marketId: string,
    selection: string,
    betAmount: number,
  ) {
    const event = await prisma.virtualEvent.findUnique({
      where: { id: eventId },
      include: {
        sport: true,
        markets: { where: { id: marketId } },
      },
    });

    if (!event) throw new Error('Event not found');
    if (event.status !== 'UPCOMING') throw new Error('Event is no longer accepting bets');

    const market = event.markets[0];
    if (!market) throw new Error('Market not found');
    if (!market.isOpen) throw new Error('Market is closed');

    const options = market.options as Array<{ key: string; label: string; odds: number }>;
    const option = options.find((o) => o.key === selection);
    if (!option) throw new Error('Invalid selection');

    const sport = event.sport;
    if (betAmount < sport.minBet) throw new Error(`Minimum bet is $${sport.minBet}`);
    if (betAmount > sport.maxBet) throw new Error(`Maximum bet is $${sport.maxBet}`);

    return prisma.$transaction(async (tx) => {
      const deducted = await tx.user.updateMany({
        where: { id: userId, balanceUSD: { gte: betAmount } },
        data: { balanceUSD: { decrement: betAmount } },
      });

      if (deducted.count === 0) throw new Error('Insufficient balance');

      return tx.virtualBet.create({
        data: {
          userId,
          eventId,
          marketId,
          selection,
          odds: option.odds,
          betAmount,
          status: 'PENDING',
        },
      });
    });
  }

  async getUserBetHistory(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [bets, total] = await Promise.all([
      prisma.virtualBet.findMany({
        where: { userId },
        include: {
          event: { select: { sportType: true, participants: true, startTime: true, outcome: true, status: true } },
          market: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.virtualBet.count({ where: { userId } }),
    ]);
    return { bets, total };
  }

  async getAllBets(page = 1, pageSize = 25, filters?: { eventId?: string; search?: string }) {
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.search) {
      where.user = { email: { contains: filters.search, mode: 'insensitive' } };
    }
    const [bets, total] = await Promise.all([
      prisma.virtualBet.findMany({
        where,
        include: {
          user: { select: { email: true } },
          event: { select: { sportType: true, participants: true, startTime: true, status: true, outcome: true } },
          market: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.virtualBet.count({ where }),
    ]);
    return { bets, total };
  }

  async updateSportConfig(
    sportType: string,
    updates: { isEnabled?: boolean; minBet?: number; maxBet?: number; oddsConfig?: Record<string, number> },
  ) {
    const validSportTypes = ['FOOTBALL', 'BASKETBALL', 'HORSE_RACING', 'DOG_RACING', 'TENNIS', 'MOTOR_RACING'];
    if (!validSportTypes.includes(sportType)) {
      throw new Error(`Invalid sport type: ${sportType}`);
    }
    return prisma.virtualSport.update({
      where: { sportType: sportType as 'FOOTBALL' | 'BASKETBALL' | 'HORSE_RACING' | 'DOG_RACING' | 'TENNIS' | 'MOTOR_RACING' },
      data: {
        ...(updates.isEnabled !== undefined && { isEnabled: updates.isEnabled }),
        ...(updates.minBet !== undefined && { minBet: updates.minBet }),
        ...(updates.maxBet !== undefined && { maxBet: updates.maxBet }),
        ...(updates.oddsConfig !== undefined && { oddsConfig: updates.oddsConfig }),
      },
    });
  }

  async manuallyResolveEvent(eventId: string): Promise<void> {
    const event = await prisma.virtualEvent.findUnique({
      where: { id: eventId },
      include: { markets: true },
    });
    if (!event) throw new Error('Event not found');
    if (event.status === 'SETTLED') throw new Error('Event is already settled');

    const seed = event.id;
    const rng = seededRng(seed);
    const participants = event.participants as string[];
    const { outcomeKey, resultDetails } = resolveOutcomeForSport(event.sportType, participants, rng);

    await prisma.$transaction(async (tx) => {
      await tx.virtualEvent.update({
        where: { id: event.id },
        data: {
          status: 'SETTLED',
          outcome: outcomeKey,
          resultDetails,
          markets: { updateMany: { where: { eventId: event.id }, data: { isOpen: false } } },
        },
      });

      const pendingBets = await tx.virtualBet.findMany({
        where: { eventId: event.id, status: 'PENDING' },
      });

      for (const bet of pendingBets) {
        const won = bet.selection === outcomeKey;
        const payout = won ? bet.betAmount * bet.odds : 0;

        await tx.virtualBet.update({
          where: { id: bet.id },
          data: {
            status: won ? 'WON' : 'LOST',
            payout,
            settledAt: new Date(),
          },
        });

        if (won) {
          await tx.user.update({
            where: { id: bet.userId },
            data: { balanceUSD: { increment: payout } },
          });
        }
      }
    });
  }

  async getAllSports() {
    await this.ensureSportsExist();
    return prisma.virtualSport.findMany({ orderBy: { sportType: 'asc' } });
  }
}

export const virtualSportsService = new VirtualSportsService();
