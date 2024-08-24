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

        try {
            const createVehicleDto = new CreateVehicleDto();
            Object.assign(createVehicleDto, data);

            await validateOrReject(createVehicleDto);

            const price = parseFloat(createVehicleDto.price);

            const vehicleData: Prisma.VehicleCreateInput = {
                model: createVehicleDto.model,
                type: createVehicleDto.type,
                code: createVehicleDto.code,
                version: createVehicleDto.version,
                year: createVehicleDto.year,
                mileage: createVehicleDto.mileage,
                transmission: createVehicleDto.transmission,
                bodyType: createVehicleDto.bodyType,
                fuelType: createVehicleDto.fuelType,
                licensePlateEnd: createVehicleDto.licensePlateEnd,
                color: createVehicleDto.color,
                price: price,
                acceptsTrade: createVehicleDto.acceptsTrade,
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

    async findAll() {
        try {
            const vehicles = await this.prisma.vehicle.findMany();
            return vehicles;
        } catch (error) {
            throw new BadRequestException('Erro ao buscar veículos');
        }
    }

    async findOne(id: string) {
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id } })
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

            const updatedData: Prisma.VehicleUpdateInput = {
                model: data.model,
                type: data.type,
                code: data.code,
                version: data.version,
                year: data.year,
                mileage: data.mileage,
                transmission: data.transmission,
                bodyType: data.bodyType,
                fuelType: data.fuelType,
                licensePlateEnd: data.licensePlateEnd,
                color: data.color,
                price: data.price ? parseFloat(data.price) : undefined,
                acceptsTrade: data.acceptsTrade,
                features: data.features,
                ...(data.makeId ? { make: { connect: { id: data.makeId } } } : {}),
            };

            return await this.prisma.vehicle.update({
                where: { id },
                data: updatedData
            });

        } catch (e) {
            console.log(e)
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

    remove(id: string) {
        return `This action removes a #${id} vehicle`;
    }
}
