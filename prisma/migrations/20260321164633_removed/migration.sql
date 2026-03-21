/*
  Warnings:

  - You are about to drop the column `guestId` on the `WatchpartyMember` table. All the data in the column will be lost.
  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WatchpartyMember" DROP CONSTRAINT "WatchpartyMember_guestId_fkey";

-- AlterTable
ALTER TABLE "WatchpartyMember" DROP COLUMN "guestId";

-- DropTable
DROP TABLE "Guest";
