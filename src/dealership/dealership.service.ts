import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealershipDto } from './dto/create-dealership.dto';
import { UpdateDealershipDto } from './dto/update-dealership.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { validateOrReject, ValidationError } from 'class-validator';
import { Prisma } from '@prisma/client';

@Injectable()
export class DealershipService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateDealershipDto) {
        try {
            const createDealershipDto = new CreateDealershipDto();
            Object.assign(createDealershipDto, data);

            await validateOrReject(createDealershipDto);

            return this.prisma.dealership.create({ data: createDealershipDto as Prisma.DealershipCreateInput });
        } catch (e) {
            if (e instanceof Array && e[0] instanceof ValidationError) {
                const errorMessages = e.map(error =>
                    Object.values(error.constraints || {}).join(", ")
                );

                throw new BadRequestException({
                    message: errorMessages,
                    errors: e
                });
            }

            if (e instanceof Prisma.PrismaClientUnknownRequestError) {
                throw e;
            }

            throw new BadRequestException("Erro ao criar concessionária");
        }
    }

    async findAll() {
        return this.prisma.dealership.findMany()
    }

    async findOne(id: string) {
        const dealership = await this.prisma.dealership.findUnique({ where: { id }, include: { stores: true } })
        if (!dealership) {
            throw new NotFoundException("Concecionária não encontrada")
        }
        return dealership;
    }

    async update(id: string, data: UpdateDealershipDto) {
        const dealership = await this.prisma.dealership.findUnique({ where: { id } })
        if (!dealership) {
            throw new NotFoundException("Concecionária não encontrada")
        }

        try {
            const updateDealershipDto = new UpdateDealershipDto();
            Object.assign(updateDealershipDto, data);

            await validateOrReject(updateDealershipDto);

            return await this.prisma.dealership.update({ where: { id }, data: updateDealershipDto as Prisma.DealershipCreateInput });
        } catch (e) {
            if (e instanceof Array && e[0] instanceof ValidationError) {
                const errorMessages = e.map(error =>
                    Object.values(error.constraints || {}).join(", ")
                );

                throw new BadRequestException({
                    message: errorMessages,
                    errors: e
                });
            }

            if (e instanceof Prisma.PrismaClientUnknownRequestError) {
                throw e;
            }

            throw new BadRequestException("Erro ao criar concessionária");
        }
    }

    async remove(id: string) {
        const dealership = await this.prisma.dealership.findUnique({ where: { id } });
        if (!dealership) {
            throw new NotFoundException("Concessionária não encontrada");
        }

        await this.prisma.dealership.delete({ where: { id } });
    }
}
