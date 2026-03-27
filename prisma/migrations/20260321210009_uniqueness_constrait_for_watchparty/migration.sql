/*
  Warnings:

  - A unique constraint covering the columns `[watchPartyId,userId]` on the table `WatchpartyMember` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `WatchpartyMember` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WatchpartyMember" DROP CONSTRAINT "WatchpartyMember_userId_fkey";

-- AlterTable
ALTER TABLE "WatchpartyMember" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WatchpartyMember_watchPartyId_userId_key" ON "WatchpartyMember"("watchPartyId", "userId");

-- AddForeignKey
ALTER TABLE "WatchpartyMember" ADD CONSTRAINT "WatchpartyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
