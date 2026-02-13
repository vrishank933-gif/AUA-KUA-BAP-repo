/*
  Warnings:

  - You are about to drop the column `isVerified` on the `master_users` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `master_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "master_users" DROP COLUMN "isVerified",
DROP COLUMN "otp",
ALTER COLUMN "userid" SET DEFAULT 'U2026' || lpad(nextval('master_users_seq')::text, 4, '0');
