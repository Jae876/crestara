import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserRole } from '@crestara/shared';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview(adminId: string, adminRole: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const [usersCount, totalDeposited, totalWithdrawn, activeBots] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.transaction.aggregate({
        where: { type: 'DEPOSIT', status: 'CONFIRMED' },
        _sum: { amountUSD: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'WITHDRAWAL', status: 'CONFIRMED' },
        _sum: { amountUSD: true },
      }),
      this.prisma.miningBot.count({
        where: { status: 'ACTIVE' },
      }),
    ]);

    return {
      usersCount,
      totalDeposited: totalDeposited._sum?.amountUSD || 0,
      totalWithdrawn: totalWithdrawn._sum?.amountUSD || 0,
      activeBots,
    };
  }

  async listUsers(adminRole: string, limit = 20, offset = 0) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const users = await this.prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        role: true,
        balanceUSD: true,
        bonusBalance: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count();

    return { data: users, total, limit, offset };
  }

  async getUserDetails(adminRole: string, userId: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: { take: 10, orderBy: { createdAt: 'desc' } },
        bets: { take: 10, orderBy: { createdAt: 'desc' } },
        miningBots: true,
        bonuses: true,
      },
    });

    return user;
  }

  async updateUserBalance(adminRole: string, userId: string, newBalance: number, note?: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { balanceUSD: newBalance },
    });

    // Log audit
    await this.prisma.auditLog.create({
      data: {
        userId: userId,
        action: 'BALANCE_UPDATE',
        resource: 'User',
        details: { newBalance, note },
      },
    });

    return user;
  }

  async banUser(adminRole: string, userId: string, reason: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    // In a real system, you'd add a 'banned' status or field
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'USER_BANNED',
        resource: 'User',
        details: { reason },
      },
    });

    return { success: true, message: `User ${userId} banned` };
  }

  async listTransactions(adminRole: string, limit = 20, offset = 0) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const transactions = await this.prisma.transaction.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
    });

    const total = await this.prisma.transaction.count();

    return { data: transactions, total, limit, offset };
  }

  async approveTransaction(adminRole: string, transactionId: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const tx = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'CONFIRMED' },
    });

    return tx;
  }

  async rejectTransaction(adminRole: string, transactionId: string) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const tx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    // Refund if deposit
    if (tx.type === 'DEPOSIT') {
      await this.prisma.user.update({
        where: { id: tx.userId },
        data: { balanceUSD: { increment: tx.amountUSD } },
      });
    }

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'FAILED' },
    });

    return tx;
  }

  async updateGameConfig(adminRole: string, gameType: string, houseEdge: number) {
    if (adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return this.prisma.gameConfig.update({
      where: { gameType: gameType as any },
      data: { houseEdgePercent: houseEdge },
    });
  }
}
