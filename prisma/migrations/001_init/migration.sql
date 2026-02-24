-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'GAME_PAYOUT', 'MINING_PAYOUT', 'BONUS_CREDIT', 'REFERRAL_BONUS');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('CRASH', 'PLINKO', 'DICE', 'MINES', 'COINFLIP', 'KENO', 'SLOTS', 'ROULETTE');

-- CreateEnum
CREATE TYPE "MiningPackageType" AS ENUM ('BASIC', 'PRO', 'ELITE');

-- CreateEnum
CREATE TYPE "MiningCoinType" AS ENUM ('BTC', 'ETH', 'XMR', 'LTC', 'DOGE', 'RVN', 'ZEC', 'XRP', 'SOL');

-- CreateEnum
CREATE TYPE "BonusType" AS ENUM ('WELCOME', 'FREE_SPINS', 'REFERRAL');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'CONVERTED', 'CREDITED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "balanceUSD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonusBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kycVerifiedAt" TIMESTAMP(3),
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "coinSymbol" TEXT NOT NULL,
    "networkType" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountUSD" DOUBLE PRECISION NOT NULL,
    "depositAddress" TEXT,
    "destinationAddress" TEXT,
    "txHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "betAmount" DOUBLE PRECISION NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "payout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outcome" TEXT NOT NULL,
    "clientSeed" TEXT,
    "serverSeed" TEXT,
    "hash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BonusType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "wagerRequired" DOUBLE PRECISION NOT NULL,
    "wagered" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiningBot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageType" "MiningPackageType" NOT NULL,
    "coin" "MiningCoinType" NOT NULL,
    "activationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "dailyRate" DOUBLE PRECISION NOT NULL,
    "totalMined" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiningBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creditedAt" TIMESTAMP(3),

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameConfig" (
    "id" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "houseEdgePercent" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "minBet" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "maxBet" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_coinSymbol_idx" ON "Transaction"("coinSymbol");

-- CreateIndex
CREATE INDEX "Bet_userId_idx" ON "Bet"("userId");

-- CreateIndex
CREATE INDEX "Bet_gameType_idx" ON "Bet"("gameType");

-- CreateIndex
CREATE INDEX "Bonus_userId_idx" ON "Bonus"("userId");

-- CreateIndex
CREATE INDEX "Bonus_isActive_idx" ON "Bonus"("isActive");

-- CreateIndex
CREATE INDEX "MiningBot_userId_idx" ON "MiningBot"("userId");

-- CreateIndex
CREATE INDEX "MiningBot_status_idx" ON "MiningBot"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerId_referredUserId_key" ON "Referral"("referrerId", "referredUserId");

-- CreateIndex
CREATE INDEX "Referral_referralCode_idx" ON "Referral"("referralCode");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GameConfig_gameType_key" ON "GameConfig"("gameType");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiningBot" ADD CONSTRAINT "MiningBot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
