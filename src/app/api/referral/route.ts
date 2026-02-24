import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    // Get user's referral info
    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: {
        referralCode: true,
        _count: { select: { referrals: true } },
      },
    });

    // Get referral stats
    const referrals = await prisma.referral.findMany({
      where: { referrerId: auth.sub },
    });

    const totalBonus = referrals.reduce((sum, r) => sum + r.bonusAmount, 0);
    const convertedCount = referrals.filter(r => r.status === 'CONVERTED').length;

    return NextResponse.json({
      message: 'Referral program',
      referralCode: user?.referralCode,
      commission: '10%',
      stats: {
        totalReferrals: user?._count.referrals || 0,
        convertedReferrals: convertedCount,
        totalBonus,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);

    const body = await request.json();
    const { action, referralCode } = body;

    if (action === 'use_referral' && referralCode) {
      // Find the referrer
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 },
        );
      }

      // Create referral record
      const referral = await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredUserId: auth.sub,
          referralCode,
        },
      });

      return NextResponse.json(
        { message: 'Referral applied', referral },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process referral' },
      { status: 400 },
    );
  }
}
