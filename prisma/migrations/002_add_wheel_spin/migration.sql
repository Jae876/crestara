-- CreateTable
CREATE TABLE "WheelSpin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "depositId" TEXT,
    "spinsAllocated" INTEGER NOT NULL,
    "spinsUsed" INTEGER NOT NULL DEFAULT 0,
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WheelSpin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelSpinResult" (
    "id" TEXT NOT NULL,
    "wheelSpinId" TEXT NOT NULL,
    "prizeLabel" TEXT NOT NULL,
    "prizeAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WheelSpinResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WheelSpin_userId_idx" ON "WheelSpin"("userId");

-- CreateIndex
CREATE INDEX "WheelSpinResult_wheelSpinId_idx" ON "WheelSpinResult"("wheelSpinId");

-- AddForeignKey
ALTER TABLE "WheelSpin" ADD CONSTRAINT "WheelSpin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelSpinResult" ADD CONSTRAINT "WheelSpinResult_wheelSpinId_fkey" FOREIGN KEY ("wheelSpinId") REFERENCES "WheelSpin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
