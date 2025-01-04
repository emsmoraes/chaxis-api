import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class VehicleTypeService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.vehicleType.findMany();
    }
}
