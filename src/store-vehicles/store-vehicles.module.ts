import { Module } from '@nestjs/common';
import { StoreVehiclesService } from './store-vehicles.service';
import { StoreVehiclesController } from './store-vehicles.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [StoreVehiclesController],
  providers: [StoreVehiclesService, PrismaService],
})
export class StoreVehiclesModule {}
