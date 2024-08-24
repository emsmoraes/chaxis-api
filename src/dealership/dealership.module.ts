import { Module } from '@nestjs/common';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { DealershipController } from './dealership.controller';
import { DealershipService } from './dealership.service';

@Module({
    controllers: [DealershipController],
    providers: [DealershipService, PrismaService],
})
export class DealershipModule { }
