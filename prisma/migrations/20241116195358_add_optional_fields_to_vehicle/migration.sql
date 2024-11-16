-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "doors" INTEGER DEFAULT 4,
ADD COLUMN     "engine_power" TEXT DEFAULT 'Não especificado',
ADD COLUMN     "has_gnv_kit" BOOLEAN DEFAULT false,
ADD COLUMN     "steeringType" TEXT;
