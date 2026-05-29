/*
  Warnings:

  - The values [DISPUTE_OPENED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `capacityVolume` on the `CarrierVehicle` table. All the data in the column will be lost.
  - You are about to drop the column `capacityWeight` on the `CarrierVehicle` table. All the data in the column will be lost.
  - You are about to drop the column `disputeId` on the `DisputeAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `disputeId` on the `DisputeMessage` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `height` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `length` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `width` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `claimId` to the `DisputeAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimId` to the `DisputeMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GovernmentIdType" AS ENUM ('PASSPORT', 'DRIVING_LICENSE', 'NATIONAL_ID');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('BID_RECEIVED', 'BID_ACCEPTED', 'BID_REJECTED', 'SHIPMENT_UPDATE', 'PAYMENT_RECEIVED', 'CLAIM_FILED', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "DisputeAttachment" DROP CONSTRAINT "DisputeAttachment_disputeId_fkey";

-- DropForeignKey
ALTER TABLE "DisputeMessage" DROP CONSTRAINT "DisputeMessage_disputeId_fkey";

-- DropIndex
DROP INDEX "DisputeAttachment_disputeId_idx";

-- DropIndex
DROP INDEX "DisputeMessage_disputeId_createdAt_idx";

-- AlterTable
ALTER TABLE "Carrier" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "governmentIdType" "GovernmentIdType",
ADD COLUMN     "idBackUrl" TEXT,
ADD COLUMN     "idFrontUrl" TEXT,
ADD COLUMN     "selfieUrl" TEXT;

-- AlterTable
ALTER TABLE "CarrierVehicle" DROP COLUMN "capacityVolume",
DROP COLUMN "capacityWeight",
ADD COLUMN     "insuranceDocUrl" TEXT,
ADD COLUMN     "loadCapacity" DOUBLE PRECISION,
ADD COLUMN     "registrationDocUrl" TEXT,
ADD COLUMN     "vehicleBrand" TEXT,
ADD COLUMN     "vehicleModel" TEXT;

-- AlterTable
ALTER TABLE "DisputeAttachment" DROP COLUMN "disputeId",
ADD COLUMN     "claimId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DisputeMessage" DROP COLUMN "disputeId",
ADD COLUMN     "claimId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "subcategory" TEXT,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "height" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "length" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "width" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "industry" TEXT,
ADD COLUMN     "tier" TEXT DEFAULT 'BRONZE';

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Otp_email_idx" ON "Otp"("email");

-- CreateIndex
CREATE INDEX "Otp_phone_idx" ON "Otp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");

-- CreateIndex
CREATE INDEX "DisputeAttachment_claimId_idx" ON "DisputeAttachment"("claimId");

-- CreateIndex
CREATE INDEX "DisputeMessage_claimId_createdAt_idx" ON "DisputeMessage"("claimId", "createdAt");

-- AddForeignKey
ALTER TABLE "DisputeMessage" ADD CONSTRAINT "DisputeMessage_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeAttachment" ADD CONSTRAINT "DisputeAttachment_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
