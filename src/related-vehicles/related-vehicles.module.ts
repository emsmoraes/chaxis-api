import { Module } from '@nestjs/common';
import { RelatedVehiclesService } from './related-vehicles.service';
import { RelatedVehiclesController } from './related-vehicles.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Module({
  controllers: [RelatedVehiclesController],
  providers: [RelatedVehiclesService, PrismaService],
})
export class RelatedVehiclesModule {}
