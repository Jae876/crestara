-- CreateEnum
CREATE TYPE "VirtualSportType" AS ENUM ('FOOTBALL', 'BASKETBALL', 'HORSE_RACING', 'DOG_RACING', 'TENNIS', 'MOTOR_RACING');

-- CreateEnum
CREATE TYPE "VirtualEventStatus" AS ENUM ('UPCOMING', 'LIVE', 'SETTLED');

-- CreateEnum
CREATE TYPE "VirtualBetStatus" AS ENUM ('PENDING', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "VirtualSport" (
    "id" TEXT NOT NULL,
    "sportType" "VirtualSportType" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "minBet" DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    "maxBet" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "oddsConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualSport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEvent" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "sportType" "VirtualSportType" NOT NULL,
    "participants" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "status" "VirtualEventStatus" NOT NULL DEFAULT 'UPCOMING',
    "outcome" TEXT,
    "resultDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualMarket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualMarket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualBet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "selection" TEXT NOT NULL,
    "odds" DOUBLE PRECISION NOT NULL,
    "betAmount" DOUBLE PRECISION NOT NULL,
    "payout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "VirtualBetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),

    CONSTRAINT "VirtualBet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualSport_sportType_key" ON "VirtualSport"("sportType");

-- CreateIndex
CREATE INDEX "VirtualSport_sportType_idx" ON "VirtualSport"("sportType");

-- CreateIndex
CREATE INDEX "VirtualEvent_sportType_idx" ON "VirtualEvent"("sportType");

-- CreateIndex
CREATE INDEX "VirtualEvent_status_idx" ON "VirtualEvent"("status");

-- CreateIndex
CREATE INDEX "VirtualEvent_startTime_idx" ON "VirtualEvent"("startTime");

-- CreateIndex
CREATE INDEX "VirtualMarket_eventId_idx" ON "VirtualMarket"("eventId");

-- CreateIndex
CREATE INDEX "VirtualBet_userId_idx" ON "VirtualBet"("userId");

-- CreateIndex
CREATE INDEX "VirtualBet_eventId_idx" ON "VirtualBet"("eventId");

-- CreateIndex
CREATE INDEX "VirtualBet_status_idx" ON "VirtualBet"("status");

-- AddForeignKey
ALTER TABLE "VirtualEvent" ADD CONSTRAINT "VirtualEvent_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "VirtualSport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualMarket" ADD CONSTRAINT "VirtualMarket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "VirtualEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBet" ADD CONSTRAINT "VirtualBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBet" ADD CONSTRAINT "VirtualBet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "VirtualEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualBet" ADD CONSTRAINT "VirtualBet_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "VirtualMarket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
