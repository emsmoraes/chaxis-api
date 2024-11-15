import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { validateOrReject, ValidationError } from 'class-validator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
    constructor(private readonly prisma: PrismaService) { }
    async create(data: CreateStoreDto) {
        const { dealershipId } = data
        const dealership = await this.prisma.dealership.findFirst({ where: { id: dealershipId } })
        if (!dealership) {
            throw new NotFoundException("Concecionária não encontrada")
        }
        try {
            const createStoreDto = new CreateStoreDto();
            Object.assign(createStoreDto, data);

            await validateOrReject(createStoreDto);

            const storeData: Prisma.StoreCreateInput = {
                name: createStoreDto.name,
                description: createStoreDto.description,
                address: createStoreDto.address,
                phone: createStoreDto.phone,
                city: createStoreDto.city,
                state: createStoreDto.state,
                postalCode: createStoreDto.postalCode,
                country: createStoreDto.country,
                dealership: {
                    connect: { id: createStoreDto.dealershipId },
                },
                createdAt: createStoreDto.createdAt,
                updatedAt: createStoreDto.updatedAt,
            };

            return this.prisma.store.create({ data: storeData });
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

            throw new BadRequestException("Erro ao criar loja");
        }
    }

    findAll(filters: { name?: string; state?: string; city?: string }) {
        const { name, state, city } = filters;

        return this.prisma.store.findMany({
            where: {
                name: name ? { contains: name, mode: 'insensitive' } : undefined,
                state: state ? { equals: state, mode: 'insensitive' } : undefined,
                city: city ? { contains: city, mode: 'insensitive' } : undefined,
            },
        });
    }

    async findOne(id: string) {
        const store = await this.prisma.store.findUnique({
          where: { id },
          include: {
            file: true,
          },
        });

        if (!store) {
          throw new NotFoundException("Loja não encontrada");
        }

        const vehicleCount = await this.prisma.vehicle.count({
          where: {
            storeId: id,
          },
        });

        return {
          ...store,
          vehicleCount,
        };
      }

    async update(id: string, data: UpdateStoreDto) {
        try {
            const existingStore = await this.prisma.store.findUnique({ where: { id } });
            if (!existingStore) {
                throw new NotFoundException("Loja não encontrada");
            }

            const updateStoreDto = new UpdateStoreDto();
            Object.assign(updateStoreDto, data);
            await validateOrReject(updateStoreDto);

            const updatedStore = await this.prisma.store.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country,
                    phone: data.phone,
                },
                include: {
                    file: true
                }
            });

            return updatedStore;
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

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException("Erro ao atualizar a loja");
            }

            throw e;
        }
    }

    async remove(id: string) {
        try {
            const existingStore = await this.prisma.store.findUnique({ where: { id } });
            if (!existingStore) {
                throw new NotFoundException("Loja não encontrada");
            }

            await this.prisma.store.delete({ where: { id } });

            return { message: `Loja removida com sucesso` };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException("Erro ao remover a loja");
            }
            throw e;
        }
    }
}
