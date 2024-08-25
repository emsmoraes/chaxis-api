import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService, AwsService],
})
export class StoreModule {}
