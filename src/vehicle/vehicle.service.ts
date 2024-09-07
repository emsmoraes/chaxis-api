import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { validateOrReject, ValidationError } from 'class-validator';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateVehicleDto) {
        const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
        if (!store) {
            throw new NotFoundException("Loja não encontrada");
        }

        const make = await this.prisma.brand.findUnique({ where: { id: data.makeId } });
        if (!make) {
            throw new NotFoundException("Marca não encontrada");
        }

        const vehicleType = await this.prisma.vehicleType.findUnique({ where: { id: data.vehicleTypeId } });
        if (!vehicleType) {
            throw new NotFoundException("Tipo de veículo não encontrado");
        }

        const bodyType = await this.prisma.bodyType.findUnique({ where: { id: data.bodyTypeId } });
        if (!bodyType) {
            throw new NotFoundException("Tipo de carroceria não encontrado");
        }

        try {
            const createVehicleDto = new CreateVehicleDto();
            Object.assign(createVehicleDto, data);
            await validateOrReject(createVehicleDto);

            const price = parseFloat(createVehicleDto.price);
            const mileage = Number(createVehicleDto.mileage);
            const acceptsTrade = JSON.parse(createVehicleDto.acceptsTrade)
            const searchTerm = `${createVehicleDto.model} ${createVehicleDto.version}`

            const vehicleData: Prisma.VehicleCreateInput = {
                model: createVehicleDto.model,
                vehicleType: { connect: { id: createVehicleDto.vehicleTypeId } },
                code: createVehicleDto.code,
                version: createVehicleDto.version,
                year: createVehicleDto.year,
                mileage: mileage,
                searchTerm: searchTerm,
                transmission: createVehicleDto.transmission,
                bodyType: { connect: { id: createVehicleDto.bodyTypeId } },
                fuelType: createVehicleDto.fuelType,
                licensePlateEnd: createVehicleDto.licensePlateEnd,
                color: createVehicleDto.color,
                price: price,
                acceptsTrade: acceptsTrade,
                features: createVehicleDto.features,
                store: { connect: { id: createVehicleDto.storeId } },
                make: { connect: { id: createVehicleDto.makeId } },
            };

            return this.prisma.vehicle.create({ data: vehicleData });
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

            throw new BadRequestException("Erro ao criar veículo");
        }
    }

    async findAll({
        page = 1,
        limit = 10,
        makeId,
        yearMin,
        yearMax,
        priceMin,
        priceMax,
        mileageMin,
        mileageMax,
        transmission,
        state,
        city,
        searchTerm
    }: {
        page?: number;
        limit?: number;
        makeId?: string;
        yearMin?: number;
        yearMax?: number;
        priceMin?: number;
        priceMax?: number;
        mileageMin?: number;
        mileageMax?: number;
        transmission?: string;
        state?: string;
        city?: string;
        searchTerm?: string;
    }) {
        page = Number(page);
        limit = Number(limit);
        mileageMin = Number(mileageMin);
        mileageMax = Number(mileageMax);

        const offset = (page - 1) * limit;

        console.log(searchTerm)

        const where: Prisma.VehicleWhereInput = {
            AND: [
                makeId ? { makeId } : undefined,
                yearMin ? { year: { gte: String(yearMin) } } : undefined,
                yearMax ? { year: { lte: String(yearMax) } } : undefined,
                priceMin ? { price: { gte: priceMin } } : undefined,
                priceMax ? { price: { lte: priceMax } } : undefined,
                mileageMin ? { mileage: { gte: mileageMin } } : undefined,
                mileageMax ? { mileage: { lte: mileageMax } } : undefined,
                transmission ? { transmission } : undefined,
                state ? { store: { state } } : undefined,
                city ? { store: { city } } : undefined,
                searchTerm ? { searchTerm: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } } : undefined,
            ].filter(Boolean),
        };

        const [vehicles, totalItems] = await Promise.all([
            this.prisma.vehicle.findMany({
                skip: offset,
                take: limit,
                where,
                include: { VehicleImage: true, store: true },
            }),
            this.prisma.vehicle.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            vehicles,
            currentPage: page,
            totalItems,
            totalPages,
            itemsPerPage: limit,
        };
    }


    async findOne(id: string) {
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id }, include: { VehicleImage: true } })
        if (!vehicle) {
            throw new NotFoundException("Veículo não encontrado")
        }
        return vehicle;
    }

    async update(id: string, data: UpdateVehicleDto) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id }
        });

        if (!vehicle) {
            throw new NotFoundException('Veículo não encontrado');
        }

        const updateVehicleDto = new UpdateVehicleDto();
        Object.assign(updateVehicleDto, data);

        try {
            await validateOrReject(updateVehicleDto);

            if (data.makeId) {
                const make = await this.prisma.brand.findUnique({ where: { id: data.makeId } });
                if (!make) {
                    throw new NotFoundException('Marca não encontrada');
                }
            }

            if (data.vehicleTypeId) {
                const vehicleType = await this.prisma.vehicleType.findUnique({ where: { id: data.vehicleTypeId } });
                if (!vehicleType) {
                    throw new NotFoundException('Tipo de veículo não encontrado');
                }
            }

            if (data.bodyTypeId) {
                const bodyType = await this.prisma.bodyType.findUnique({ where: { id: data.bodyTypeId } });
                if (!bodyType) {
                    throw new NotFoundException('Tipo de carroceria não encontrado');
                }
            }

            if (data.storeId) {
                const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
                if (!store) {
                    throw new NotFoundException('Loja não encontrada');
                }
            }

            const mileage = Number(updateVehicleDto.mileage);
            const acceptsTrade = JSON.parse(updateVehicleDto.acceptsTrade)
            const searchTerm = `${updateVehicleDto.model ?? vehicle.model} ${updateVehicleDto.version ?? vehicle.version}`

            const updatedData: Prisma.VehicleUpdateInput = {
                model: data.model,
                searchTerm: searchTerm,
                vehicleType: data.vehicleTypeId ? { connect: { id: data.vehicleTypeId } } : undefined,
                code: data.code,
                version: data.version,
                year: data.year,
                mileage: mileage,
                transmission: data.transmission,
                bodyType: data.bodyTypeId ? { connect: { id: data.bodyTypeId } } : undefined,
                fuelType: data.fuelType,
                licensePlateEnd: data.licensePlateEnd,
                color: data.color,
                price: data.price ? parseFloat(data.price) : undefined,
                acceptsTrade: acceptsTrade,
                features: data.features,
                store: data.storeId ? { connect: { id: data.storeId } } : undefined,
                make: data.makeId ? { connect: { id: data.makeId } } : undefined,
            };

            return await this.prisma.vehicle.update({
                where: { id },
                data: updatedData
            });

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
                throw new BadRequestException('Erro ao atualizar veículo');
            }

            throw e;
        }
    }

    async remove(id: string) {
        try {
            const existingVehicle = await this.prisma.vehicle.findUnique({ where: { id } });
            if (!existingVehicle) {
                throw new NotFoundException("Veículo não encontrado");
            }

            await this.prisma.vehicle.delete({ where: { id } });

            return { message: `Veículo removido com sucesso` };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException("Erro ao remover a veículo");
            }
            throw e;
        }
    }
}
