/*
  Warnings:

  - You are about to drop the column `approvalRequired` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "approvalRequired";

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false;
