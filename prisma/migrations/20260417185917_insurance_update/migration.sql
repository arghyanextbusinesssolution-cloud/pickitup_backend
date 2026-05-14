/*
  Warnings:

  - The values [CANCELED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PICKED_UP] on the enum `ShipmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `weight` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `height` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `length` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `width` on the `Shipment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ShipmentStatus_new" AS ENUM ('OPEN', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Shipment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Shipment" ALTER COLUMN "status" TYPE "ShipmentStatus_new" USING ("status"::text::"ShipmentStatus_new");
ALTER TYPE "ShipmentStatus" RENAME TO "ShipmentStatus_old";
ALTER TYPE "ShipmentStatus_new" RENAME TO "ShipmentStatus";
DROP TYPE "ShipmentStatus_old";
ALTER TABLE "Shipment" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "damageDescription" TEXT,
ADD COLUMN     "damagePhotos" TEXT[],
ADD COLUMN     "deliveryOtp" TEXT,
ADD COLUMN     "deliveryPhotos" TEXT[],
ADD COLUMN     "hasInsurance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "insuranceFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isDamaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pickupPhotos" TEXT[];

-- AlterTable
ALTER TABLE "Shipment" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "destinationLatitude" DROP NOT NULL,
ALTER COLUMN "destinationLongitude" DROP NOT NULL,
ALTER COLUMN "height" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "length" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "originLatitude" DROP NOT NULL,
ALTER COLUMN "originLongitude" DROP NOT NULL,
ALTER COLUMN "width" SET DATA TYPE DOUBLE PRECISION;
