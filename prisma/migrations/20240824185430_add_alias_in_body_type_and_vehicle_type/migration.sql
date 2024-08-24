/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `BodyType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[alias]` on the table `VehicleType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alias` to the `BodyType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alias` to the `VehicleType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BodyType" ADD COLUMN     "alias" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VehicleType" ADD COLUMN     "alias" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BodyType_alias_key" ON "BodyType"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleType_alias_key" ON "VehicleType"("alias");
