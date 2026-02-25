import prisma from '@/lib/db';

export class AdminService {
  /**
   * Get all users with pagination
   */
  async getUsers(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          email: true,
          role: true,
          balanceUSD: true,
          kycStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get single user with all details
   */
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        balanceUSD: true,
        bonusBalance: true,
        kycStatus: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { bets: true, transactions: true, miningBots: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user balance (for admin operations)
   */
  async updateUserBalance(userId: string, newBalance: number, note?: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { balanceUSD: newBalance },
    });

    // Log the balance change
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'BALANCE_UPDATED',
        resource: 'user',
        details: {
          newBalance,
          previousBalance: user.balanceUSD,
          note,
        },
      },
    });

    return user;
  }

  /**
   * Ban/suspend a user
   */
  async banUser(userId: string, reason: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' }, // Could add a 'BANNED' role in the future
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'USER_BANNED',
        resource: 'user',
        details: { reason },
      },
    });

    return user;
  }

  /**
   * Get all transactions with filters
   */
  async getTransactions(page: number = 1, pageSize: number = 20, filters?: any) {
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};
    if (filters?.userId) whereClause.userId = filters.userId;
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.type) whereClause.type = filters.type;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get all gaming bets with filters
   */
  async getBets(page: number = 1, pageSize: number = 20, filters?: any) {
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};
    if (filters?.userId) whereClause.userId = filters.userId;
    if (filters?.gameType) whereClause.gameType = filters.gameType;

    const [bets, total] = await Promise.all([
      prisma.bet.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bet.count({ where: whereClause }),
    ]);

    return {
      bets,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Update game configuration (house edge, limits)
   */
  async updateGameConfig(gameType: string, houseEdgePercent: number, minBet?: number, maxBet?: number) {
    const config = await prisma.gameConfig.upsert({
      where: { gameType: gameType as any },
      update: {
        houseEdgePercent,
        ...(minBet !== undefined && { minBet }),
        ...(maxBet !== undefined && { maxBet }),
      },
      create: {
        gameType: gameType as any,
        houseEdgePercent,
        minBet: minBet || 0.01,
        maxBet: maxBet || 10000,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: undefined, // System action
        action: 'GAME_CONFIG_UPDATED',
        resource: 'game_config',
        details: { gameType, houseEdgePercent, minBet, maxBet },
      },
    });

    return config;
  }

  /**
   * Get gaming statistics
   */
  async getGameStats() {
    const [totalBets, totalWagered, totalPayouts, betsByGame] = await Promise.all([
      prisma.bet.count(),
      prisma.bet.aggregate({ _sum: { betAmount: true } }),
      prisma.bet.aggregate({ _sum: { payout: true } }),
      prisma.bet.groupBy({
        by: ['gameType'],
        _count: true,
        _sum: { betAmount: true, payout: true },
      }),
    ]);

    return {
      totalBets,
      totalWagered: totalWagered._sum.betAmount || 0,
      totalPayouts: totalPayouts._sum.payout || 0,
      houseProfit: (totalWagered._sum.betAmount || 0) - (totalPayouts._sum.payout || 0),
      byGame: betsByGame,
    };
  }

  /**
   * Get mining statistics
   */
  async getMiningStats() {
    const [activeBots, totalMined, botsByPackage] = await Promise.all([
      prisma.miningBot.count({ where: { status: 'ACTIVE' } }),
      prisma.miningBot.aggregate({ _sum: { totalMined: true } }),
      prisma.miningBot.groupBy({
        by: ['packageType'],
        _count: true,
        _sum: { totalMined: true },
      }),
    ]);

    return {
      activeBots,
      totalMined: totalMined._sum.totalMined || 0,
      byPackage: botsByPackage,
    };
  }

  /**
   * Get system health check
   */
  async getSystemHealth() {
    const [userCount, activeUsers, pendingTxns, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      prisma.transaction.count({ where: { status: 'PENDING' } }),
      prisma.transaction.aggregate({
        where: { type: 'DEPOSIT' },
        _sum: { amountUSD: true },
      }),
    ]);

    return {
      totalUsers: userCount,
      activeUsers24h: activeUsers,
      pendingTransactions: pendingTxns,
      totalRevenueUSD: totalRevenue._sum.amountUSD || 0,
      timestamp: new Date(),
    };
  }
}
