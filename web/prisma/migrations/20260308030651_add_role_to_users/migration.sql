-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADVERTISER', 'AFFILIATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole";
