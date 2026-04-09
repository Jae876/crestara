import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const ADMIN_KEY = 'jaeseanjae';

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get('X-Admin-Key') === ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'PENDING';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  const [withdrawals, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { type: 'WITHDRAWAL', status: status as any },
      include: {
        user: { select: { id: true, email: true, balanceUSD: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where: { type: 'WITHDRAWAL', status: status as any } }),
  ]);

  return NextResponse.json({ withdrawals, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { transactionId, action, txHash } = await request.json();

  if (!['APPROVE', 'REJECT'].includes(action)) {
    return NextResponse.json({ error: 'action must be APPROVE or REJECT' }, { status: 400 });
  }

  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true },
  });

  if (!tx || tx.type !== 'WITHDRAWAL') {
    return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
  }
  if (tx.status !== 'PENDING') {
    return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
  }

  if (action === 'APPROVE') {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'CONFIRMED', confirmedAt: new Date(), txHash: txHash || null },
    });
  } else {
    await prisma.$transaction([
      prisma.transaction.update({ where: { id: transactionId }, data: { status: 'FAILED' } }),
      prisma.user.update({ where: { id: tx.userId }, data: { balanceUSD: { increment: tx.amountUSD } } }),
    ]);
  }

  return NextResponse.json({ message: `Withdrawal ${action === 'APPROVE' ? 'approved' : 'rejected'}` });
}
