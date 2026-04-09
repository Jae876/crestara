import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const [
      totalUsers,
      totalDeposits,
      pendingWithdrawals,
      activeBots,
      totalBets,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.aggregate({
        where: { type: 'DEPOSIT', status: 'CONFIRMED' },
        _sum: { amountUSD: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'WITHDRAWAL', status: 'PENDING' },
        _sum: { amountUSD: true },
        _count: true,
      }),
      prisma.miningBot.count({ where: { status: 'ACTIVE' } }),
      prisma.bet.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, email: true, balanceUSD: true, createdAt: true, role: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalDepositsUSD: totalDeposits._sum.amountUSD || 0,
      pendingWithdrawalsCount: pendingWithdrawals._count,
      pendingWithdrawalsUSD: pendingWithdrawals._sum.amountUSD || 0,
      activeBots,
      totalBets,
      recentUsers,
    });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status });
  }
}
