import { Module } from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeController } from './vehicle-type.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService, PrismaService],
})
export class VehicleTypeModule {}
