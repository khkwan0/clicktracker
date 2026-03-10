-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
