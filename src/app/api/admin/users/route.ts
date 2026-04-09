import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 25;

    const where = search
      ? { email: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, email: true, role: true,
          balanceUSD: true, bonusBalance: true,
          kycStatus: true, createdAt: true,
          _count: { select: { bets: true, miningBots: true, transactions: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const { userId, balanceUSD, role } = await request.json();

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const data: any = {};
    if (typeof balanceUSD === 'number') data.balanceUSD = balanceUSD;
    if (role && ['USER', 'ADMIN'].includes(role)) data.role = role;

    const user = await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json({ user: { id: user.id, email: user.email, balanceUSD: user.balanceUSD, role: user.role } });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
