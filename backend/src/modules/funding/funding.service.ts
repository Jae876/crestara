import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@crestara/shared';
import { randomUUID } from 'crypto';

interface CoinInfo {
  symbol: string;
  network: string;
  minDeposit: number;
  maxDeposit: number;
}

@Injectable()
export class FundingService {
  constructor(private prisma: PrismaService) {}

  // Mock CoinGecko data (in production, fetch from API)
  private readonly SUPPORTED_COINS: Record<string, any> = {
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      priceUSD: 45000,
      network: 'bitcoin',
      logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      priceUSD: 2800,
      network: 'ethereum',
      logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    SOL: {
      symbol: 'SOL',
      name: 'Solana',
      priceUSD: 125,
      network: 'solana',
      logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    },
    USDT: {
      symbol: 'USDT',
      name: 'USDT Tether',
      priceUSD: 1,
      network: 'ethereum',
      logo: 'https://assets.coingecko.com/coins/images/325/large/tether.png',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      priceUSD: 1,
      network: 'ethereum',
      logo: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
    },
  };

  async getSupportedCoins() {
    return Object.values(this.SUPPORTED_COINS);
  }

  async initiateDeposit(userId: string, coin: string, amount: number) {
    const coinInfo = this.SUPPORTED_COINS[coin];
    if (!coinInfo) {
      throw new Error('Coin not supported');
    }

    // Generate unique deposit address (mock)
    const depositAddress = this.generateDepositAddress(coin);

    // Create pending transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        coinSymbol: coin,
        networkType: coinInfo.network,
        amount,
        amountUSD: amount * coinInfo.priceUSD,
        depositAddress,
        metadata: {
          qrCode: `mock_qr_${depositAddress}`,
        },
      },
    });

    return {
      transactionId: transaction.id,
      depositAddress,
      coin,
      amount,
      amountUSD: amount * coinInfo.priceUSD,
      network: coinInfo.network,
    };
  }

  async confirmDeposit(transactionId: string, txHash: string) {
    const tx = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.CONFIRMED,
        txHash,
        confirmedAt: new Date(),
      },
    });

    // Credit user balance
    await this.prisma.user.update({
      where: { id: tx.userId },
      data: {
        balanceUSD: { increment: tx.amountUSD },
      },
    });

    return tx;
  }

  async initiateWithdraw(userId: string, coin: string, amount: number, destinationAddress: string) {
    const coinInfo = this.SUPPORTED_COINS[coin];
    if (!coinInfo) {
      throw new Error('Coin not supported');
    }

    // Check user balance
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const amountUSD = amount * coinInfo.priceUSD;
    if (user.balanceUSD < amountUSD) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance (move to pending)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balanceUSD: { decrement: amountUSD },
      },
    });

    // Create withdrawal transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        coinSymbol: coin,
        networkType: coinInfo.network,
        amount,
        amountUSD,
        destinationAddress,
      },
    });

    return transaction;
  }

  async getUserTransactions(userId: string, limit = 20, offset = 0) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.transaction.count({
      where: { userId },
    });

    return {
      data: transactions,
      total,
      limit,
      offset,
    };
  }

  private generateDepositAddress(coin: string): string {
    // Mock address generation (in production, use Tatum API or similar)
    const prefixes: Record<string, string> = {
      BTC: '1A',
      ETH: '0x',
      SOL: 'So',
      USDT: '0x',
      USDC: '0x',
    };

    const prefix = prefixes[coin] || '0x';
    return prefix + randomUUID().replace(/-/g, '').substring(0, 38);
  }
}
