-- CreateIndex: unique constraint on (userId, depositId) where depositId is not null
-- This prevents duplicate spin allocation for the same deposit
CREATE UNIQUE INDEX "WheelSpin_userId_depositId_key" ON "WheelSpin"("userId", "depositId") WHERE "depositId" IS NOT NULL;
