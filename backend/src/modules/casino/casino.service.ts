import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionType } from '@crestara/shared';
import * as crypto from 'crypto';

@Injectable()
export class CasinoService {
  constructor(private prisma: PrismaService) {}

  async getAvailableGames() {
    const games = await this.prisma.gameConfig.findMany({
      where: { isEnabled: true },
    });
    return games;
  }

  async placeBet(userId: string, gameType: string, betAmount: number, clientSeed?: string) {
    // Verify game exists and is enabled
    const gameConfig = await this.prisma.gameConfig.findUnique({
      where: { gameType: gameType as any },
    });

    if (!gameConfig || !gameConfig.isEnabled) {
      throw new Error('Game not available');
    }

    // Check limits
    if (betAmount < gameConfig.minBet || betAmount > gameConfig.maxBet) {
      throw new Error(`Bet must be between $${gameConfig.minBet} and $${gameConfig.maxBet}`);
    }

    // Check user balance
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const totalBalance = user.balanceUSD + user.bonusBalance;
    if (totalBalance < betAmount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from bonus first, then balance
    let deductFromBonus = Math.min(betAmount, user.bonusBalance);
    let deductFromBalance = betAmount - deductFromBonus;

    if (deductFromBonus > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { bonusBalance: { decrement: deductFromBonus } },
      });
    }

    if (deductFromBalance > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { balanceUSD: { decrement: deductFromBalance } },
      });
    }

    // Generate provably fair
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(clientSeed || '', serverSeed);

    // Simulate game outcome (mock logic)
    const outcome = this.simulateGameOutcome(hash, gameConfig.houseEdgePercent);
    const multiplier = outcome.multiplier;
    const payout = outcome.win ? betAmount * multiplier : 0;

    // Create bet record
    const bet = await this.prisma.bet.create({
      data: {
        userId,
        gameType: gameType as any,
        betAmount,
        multiplier,
        payout,
        outcome: outcome.win ? 'WIN' : 'LOSS',
        clientSeed: clientSeed || '',
        serverSeed,
        hash,
      },
    });

    // Credit payout
    if (payout > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { balanceUSD: { increment: payout } },
      });

      // Log transaction
      await this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.GAME_PAYOUT,
          status: 'CONFIRMED',
          coinSymbol: 'USD',
          amount: payout,
          amountUSD: payout,
          metadata: { betId: bet.id, gameType },
        },
      });
    }

    return {
      bet,
      balanceAfter: (await this.prisma.user.findUnique({ where: { id: userId } }))
        .balanceUSD,
    };
  }

  async getUserBets(userId: string, limit = 20, offset = 0) {
    const bets = await this.prisma.bet.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.bet.count({
      where: { userId },
    });

    return { data: bets, total, limit, offset };
  }

  async verifyProvenFair(betId: string) {
    const bet = await this.prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!bet) {
      throw new Error('Bet not found');
    }

    const recalculatedHash = this.generateHash(bet.clientSeed, bet.serverSeed);
    const isValid = recalculatedHash === bet.hash;

    return {
      betId,
      outcome: bet.outcome,
      isValid,
      clientSeed: bet.clientSeed,
      serverSeed: bet.serverSeed,
      hash: bet.hash,
      recalculatedHash,
    };
  }

  private generateHash(clientSeed: string, serverSeed: string): string {
    const combined = `${clientSeed}${serverSeed}`;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  private simulateGameOutcome(
    hash: string,
    houseEdge: number,
  ): { win: boolean; multiplier: number } {
    // Simple mock: use hash to determine outcome
    const hashValue = parseInt(hash.substring(0, 8), 16);
    const threshold = (100 - houseEdge) / 100;
    const random = (hashValue % 10000) / 10000;

    if (random < threshold) {
      const multipliers = [1.5, 2, 2.5, 3, 4, 5];
      const multiplier = multipliers[hashValue % multipliers.length];
      return { win: true, multiplier };
    }

    return { win: false, multiplier: 0 };
  }
}
