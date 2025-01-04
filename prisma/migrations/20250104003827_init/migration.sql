-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_dealershipId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_storeId_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_dealership_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_images" DROP CONSTRAINT "vehicle_images_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_bodyTypeId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_makeId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_storeId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_typeId_fkey";
