import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionType } from '@crestara/shared';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async getReferralStats(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: { referredUser: true },
    });

    const converted = referrals.filter((r) => r.status === 'CONVERTED').length;
    const credited = referrals.filter((r) => r.status === 'CREDITED').length;
    const totalBonus = referrals
      .filter((r) => r.status === 'CREDITED')
      .reduce((sum, r) => sum + r.bonusAmount, 0);

    return {
      totalReferrals: referrals.length,
      converted,
      credited,
      totalBonusEarned: totalBonus,
      referrals: referrals.map((r) => ({
        id: r.id,
        email: r.referredUser.email,
        status: r.status,
        bonusAmount: r.bonusAmount,
        createdAt: r.createdAt,
      })),
    };
  }

  async convertReferral(referralCode: string, referredUserId: string, amountDeposited: number) {
    // Find referrer by their referral code
    const referrer = await this.prisma.user.findFirst({
      where: { referralCode },
    });

    if (!referrer) {
      return null;
    }

    // Update referral status
    const referral = await this.prisma.referral.updateMany({
      where: {
        referrerId: referrer.id,
        referredUserId,
        status: 'PENDING',
      },
      data: {
        status: 'CONVERTED',
      },
    });

    return referral;
  }

  async creditReferralBonus(referredUserId: string) {
    // Find the referral entry
    const referral = await this.prisma.referral.findFirst({
      where: {
        referredUserId,
        status: 'CONVERTED',
      },
    });

    if (!referral) {
      return null;
    }

    // Credit referrer
    await this.prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        balanceUSD: { increment: referral.bonusAmount },
      },
    });

    // Update referral status
    await this.prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'CREDITED',
        creditedAt: new Date(),
      },
    });

    // Log transaction
    await this.prisma.transaction.create({
      data: {
        userId: referral.referrerId,
        type: TransactionType.REFERRAL_BONUS,
        status: 'CONFIRMED',
        coinSymbol: 'USD',
        amount: referral.bonusAmount,
        amountUSD: referral.bonusAmount,
        metadata: {
          referredUserId,
        },
      },
    });

    return referral;
  }

  async trackReferral(referralCode: string, referredUserId: string) {
    // Find referrer
    const referrer = await this.prisma.user.findFirst({
      where: { referralCode },
    });

    if (!referrer) {
      return null;
    }

    // Create referral record if not exists
    const existing = await this.prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        referredUserId,
      },
    });

    if (existing) {
      return existing;
    }

    return await this.prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId,
        referralCode,
        bonusAmount: 2, // $2 USDT
      },
    });
  }
}
