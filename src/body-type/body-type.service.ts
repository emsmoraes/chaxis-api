import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class BodyTypeService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const bodyTypes = await this.prisma.bodyType.findMany()
        return bodyTypes
    }

    findOne(id: number) {
        return `This action returns a #${id} bodyType`;
    }
}
