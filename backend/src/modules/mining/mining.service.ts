import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionType } from '@crestara/shared';

interface MiningPackage {
  type: string;
  costUSD: number;
  days: number;
  dailyRate: number;
  description: string;
}

@Injectable()
export class MiningService {
  constructor(private prisma: PrismaService) {}

  private readonly MINING_PACKAGES: Record<string, MiningPackage> = {
    BASIC: {
      type: 'BASIC',
      costUSD: 5,
      days: 90,
      dailyRate: 0.5,
      description: 'Entry-level cloud mining package',
    },
    PRO: {
      type: 'PRO',
      costUSD: 10,
      days: 120,
      dailyRate: 1.0,
      description: 'Professional mining with better returns',
    },
    ELITE: {
      type: 'ELITE',
      costUSD: 20,
      days: 180,
      dailyRate: 2.5,
      description: 'Premium mining with maximum earnings potential',
    },
  };

  async getMiningPackages() {
    return Object.values(this.MINING_PACKAGES);
  }

  async purchaseBot(userId: string, packageType: string, coin: string) {
    const pkg = this.MINING_PACKAGES[packageType];
    if (!pkg) {
      throw new Error('Invalid package type');
    }

    // Check user balance
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.balanceUSD < pkg.costUSD) {
      throw new Error('Insufficient balance to purchase bot');
    }

    // Deduct balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balanceUSD: { decrement: pkg.costUSD },
      },
    });

    // Create mining bot
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + pkg.days);

    const bot = await this.prisma.miningBot.create({
      data: {
        userId,
        packageType: packageType,
        coin: coin,
        endDate,
        dailyRate: pkg.dailyRate,
      },
    });

    // Log transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.GAME_PAYOUT, // Use as placeholder for bot purchase
        status: 'CONFIRMED',
        coinSymbol: 'USD',
        amount: pkg.costUSD,
        amountUSD: pkg.costUSD,
      },
    });

    return {
      bot,
      package: pkg,
    };
  }

  async getUserBots(userId: string) {
    return this.prisma.miningBot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processDailyPayouts() {
    // Cron job: runs daily to credit mining earnings
    const activeBots = await this.prisma.miningBot.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
      include: { user: true },
    });

    for (const bot of activeBots) {
      // Credit user balance
      await this.prisma.user.update({
        where: { id: bot.userId },
        data: {
          balanceUSD: { increment: bot.dailyRate },
        },
      });

      // Update bot total mined
      await this.prisma.miningBot.update({
        where: { id: bot.id },
        data: {
          totalMined: { increment: bot.dailyRate },
        },
      });

      // Log transaction
      await this.prisma.transaction.create({
        data: {
          userId: bot.userId,
          type: TransactionType.MINING_PAYOUT,
          status: 'CONFIRMED',
          coinSymbol: bot.coin,
          amount: bot.dailyRate / 1000, // Mock conversion
          amountUSD: bot.dailyRate,
        },
      });
    }

    return `Processed payouts for ${activeBots.length} bots`;
  }

  async checkBotExpiry() {
    // Cron job: mark expired bots as COMPLETED
    const expiredBots = await this.prisma.miningBot.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: { lte: new Date() },
      },
      data: {
        status: 'COMPLETED',
      },
    });

    return `Marked ${expiredBots.count} bots as completed`;
  }
}
