import prisma from '@/lib/db';
import { PredictionStatus, PredictionBetSettlement, PredictionCategory } from '@prisma/client';

export interface CreatePredictionInput {
  title: string;
  description: string;
  category: PredictionCategory;
  imageUrl?: string;
  bettingStartsAt: Date;
  bettingEndsAt: Date;
  options: { label: string; odds: number }[];
}

export interface UpdatePredictionInput {
  title?: string;
  description?: string;
  category?: PredictionCategory;
  imageUrl?: string;
  bettingStartsAt?: Date;
  bettingEndsAt?: Date;
  options?: { id?: string; label: string; odds: number }[];
}

export class PredictionsService {
  async listPredictions(status?: PredictionStatus, category?: PredictionCategory) {
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    return prisma.prediction.findMany({
      where,
      include: {
        options: true,
        _count: { select: { bets: true } },
      },
      orderBy: { bettingEndsAt: 'asc' },
    });
  }

  async getPrediction(id: string) {
    const prediction = await prisma.prediction.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: { select: { bets: true } },
          },
        },
        _count: { select: { bets: true } },
      },
    });
    if (!prediction) throw new Error('Prediction not found');

    const poolAgg = await prisma.predictionBet.aggregate({
      where: { predictionId: id },
      _sum: { amount: true },
    });

    return { ...prediction, totalPool: poolAgg._sum.amount || 0 };
  }

  async createPrediction(input: CreatePredictionInput) {
    return prisma.prediction.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        imageUrl: input.imageUrl,
        bettingStartsAt: input.bettingStartsAt,
        bettingEndsAt: input.bettingEndsAt,
        options: {
          create: input.options.map((o) => ({ label: o.label, odds: o.odds })),
        },
      },
      include: { options: true },
    });
  }

  async updatePrediction(id: string, input: UpdatePredictionInput) {
    const prediction = await prisma.prediction.findUnique({ where: { id } });
    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status === PredictionStatus.RESOLVED || prediction.status === PredictionStatus.CANCELLED) {
      throw new Error('Cannot edit a resolved or cancelled prediction');
    }

    const { options, ...rest } = input;

    if (options) {
      await prisma.$transaction(async (tx) => {
        await tx.prediction.update({ where: { id }, data: rest });

        for (const opt of options) {
          if (opt.id) {
            await tx.predictionOption.update({
              where: { id: opt.id },
              data: { label: opt.label, odds: opt.odds },
            });
          } else {
            await tx.predictionOption.create({
              data: { predictionId: id, label: opt.label, odds: opt.odds },
            });
          }
        }
      });
    } else {
      await prisma.prediction.update({ where: { id }, data: rest });
    }

    return this.getPrediction(id);
  }

  async openPrediction(id: string) {
    const prediction = await prisma.prediction.findUnique({ where: { id } });
    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status !== PredictionStatus.DRAFT && prediction.status !== PredictionStatus.SUSPENDED) {
      throw new Error('Only DRAFT or SUSPENDED predictions can be opened');
    }
    return prisma.prediction.update({ where: { id }, data: { status: PredictionStatus.OPEN } });
  }

  async suspendPrediction(id: string) {
    const prediction = await prisma.prediction.findUnique({ where: { id } });
    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status !== PredictionStatus.OPEN) {
      throw new Error('Only OPEN predictions can be suspended');
    }
    return prisma.prediction.update({ where: { id }, data: { status: PredictionStatus.SUSPENDED } });
  }

  async cancelPrediction(id: string) {
    const prediction = await prisma.prediction.findUnique({ where: { id } });
    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status === PredictionStatus.RESOLVED || prediction.status === PredictionStatus.CANCELLED) {
      throw new Error('Already resolved or cancelled');
    }

    await prisma.$transaction(async (tx) => {
      await tx.prediction.update({ where: { id }, data: { status: PredictionStatus.CANCELLED } });

      const pendingBets = await tx.predictionBet.findMany({
        where: { predictionId: id, settlement: PredictionBetSettlement.PENDING },
      });

      for (const bet of pendingBets) {
        await tx.predictionBet.update({
          where: { id: bet.id },
          data: { settlement: PredictionBetSettlement.REFUNDED },
        });
        await tx.user.update({
          where: { id: bet.userId },
          data: { balanceUSD: { increment: bet.amount } },
        });
      }
    });

    return this.getPrediction(id);
  }

  async resolvePrediction(id: string, winningOptionId: string) {
    const prediction = await prisma.prediction.findUnique({
      where: { id },
      include: { options: true },
    });
    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status === PredictionStatus.RESOLVED || prediction.status === PredictionStatus.CANCELLED) {
      throw new Error('Already resolved or cancelled');
    }

    const winningOption = prediction.options.find((o) => o.id === winningOptionId);
    if (!winningOption) throw new Error('Winning option not found on this prediction');

    await prisma.$transaction(async (tx) => {
      await tx.prediction.update({
        where: { id },
        data: { status: PredictionStatus.RESOLVED, resolvedOptionId: winningOptionId },
      });

      const allBets = await tx.predictionBet.findMany({
        where: { predictionId: id, settlement: PredictionBetSettlement.PENDING },
      });

      for (const bet of allBets) {
        if (bet.optionId === winningOptionId) {
          await tx.predictionBet.update({
            where: { id: bet.id },
            data: { settlement: PredictionBetSettlement.WON },
          });
          await tx.user.update({
            where: { id: bet.userId },
            data: { balanceUSD: { increment: bet.potentialPayout } },
          });
        } else {
          await tx.predictionBet.update({
            where: { id: bet.id },
            data: { settlement: PredictionBetSettlement.LOST },
          });
        }
      }
    });

    return this.getPrediction(id);
  }

  async placeBet(userId: string, predictionId: string, optionId: string, amount: number) {
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
      include: { options: true },
    });

    if (!prediction) throw new Error('Prediction not found');
    if (prediction.status !== PredictionStatus.OPEN) {
      throw new Error('Betting is not open for this prediction');
    }

    const now = new Date();
    if (now < prediction.bettingStartsAt) throw new Error('Betting has not started yet');
    if (now > prediction.bettingEndsAt) throw new Error('Betting has closed for this prediction');

    const option = prediction.options.find((o) => o.id === optionId);
    if (!option) throw new Error('Option not found on this prediction');

    if (amount <= 0) throw new Error('Bet amount must be greater than zero');

    const lockedOdds = option.odds;
    const potentialPayout = amount * lockedOdds;

    return prisma.$transaction(async (tx) => {
      const deducted = await tx.user.updateMany({
        where: { id: userId, balanceUSD: { gte: amount } },
        data: { balanceUSD: { decrement: amount } },
      });

      if (deducted.count === 0) throw new Error('Insufficient balance');

      return tx.predictionBet.create({
        data: {
          userId,
          predictionId,
          optionId,
          amount,
          lockedOdds,
          potentialPayout,
        },
        include: {
          option: true,
          prediction: { select: { title: true } },
        },
      });
    });
  }

  async getUserBets(userId: string) {
    return prisma.predictionBet.findMany({
      where: { userId },
      include: {
        prediction: { select: { id: true, title: true, status: true, resolvedOptionId: true } },
        option: { select: { id: true, label: true, odds: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPredictionBets(predictionId: string) {
    return prisma.predictionBet.findMany({
      where: { predictionId },
      include: {
        user: { select: { id: true, email: true } },
        option: { select: { id: true, label: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [activePredictions, totalWagered] = await Promise.all([
      prisma.prediction.count({ where: { status: PredictionStatus.OPEN } }),
      prisma.predictionBet.aggregate({ _sum: { amount: true } }),
    ]);
    return {
      activePredictions,
      totalWagered: totalWagered._sum.amount || 0,
    };
  }
}

export const predictionsService = new PredictionsService();
