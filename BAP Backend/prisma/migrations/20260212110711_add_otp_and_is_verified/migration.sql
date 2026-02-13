-- AlterTable
ALTER TABLE "master_users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" INTEGER;
