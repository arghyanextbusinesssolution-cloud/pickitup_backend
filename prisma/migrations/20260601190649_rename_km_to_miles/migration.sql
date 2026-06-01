/*
  Warnings:

  - You are about to drop the column `pricePerKm` on the `PricingRule` table. All the data in the column will be lost.
  - You are about to drop the column `distanceKm` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `pricePerMile` to the `PricingRule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "PricingRule" DROP COLUMN "pricePerKm",
ADD COLUMN     "pricePerMile" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "distanceKm",
ADD COLUMN     "distanceMiles" DOUBLE PRECISION;
