import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class BrandService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const brands = await this.prisma.brand.findMany()
        return brands
    }
}
