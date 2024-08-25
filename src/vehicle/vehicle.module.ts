import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PrismaService, AwsService],
})
export class VehicleModule {}
