import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const brands = await this.prisma.brand.findMany({
            where: {
                visible: true,
            },
        });
        return brands;
    }

    async update(id: string, data: UpdateBrandDto) {
        const brand = await this.prisma.brand.findUnique({
            where: { id }
        })

        if (!brand) {
            throw new NotFoundException("Marca não encontrada")
        }

        await this.prisma.brand.update({
            where: { id },
            data,
        })

        return "Marca atualizada com sucesso!"

    }
}
