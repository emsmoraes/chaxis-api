import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class RelatedVehiclesService {

    constructor(private readonly prisma: PrismaService) { }

    async findOne(vehicleId: string, limit: number) {
        const currentVehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: { make: true, bodyType: true, vehicleType: true }
        });

        if (!currentVehicle) {
            throw new Error('Veículo não encontrado');
        }

        const [brand, model, version] = currentVehicle.searchTerm.split(' ');

        const relatedVehiclesByVersion = await this.prisma.vehicle.findMany({
            where: {
                AND: [
                    { version: { equals: version } },
                    { id: { not: vehicleId } }
                ]
            },
            take: limit,
            include: { VehicleImage: true, make: true, store: true }
        });

        let relatedVehiclesByModel = [];
        if (relatedVehiclesByVersion.length < limit) {
            relatedVehiclesByModel = await this.prisma.vehicle.findMany({
                where: {
                    AND: [
                        { model: { equals: model } },
                        { id: { not: vehicleId } },
                        { version: { not: version } }
                    ]
                },
                take: limit - relatedVehiclesByVersion.length,
                include: { VehicleImage: true, make: true, store: true }
            });
        }

        let relatedVehiclesByBrand = [];
        if (relatedVehiclesByVersion.length + relatedVehiclesByModel.length < limit) {
            relatedVehiclesByBrand = await this.prisma.vehicle.findMany({
                where: {
                    AND: [
                        { make: { name: brand } },
                        { id: { not: vehicleId } },
                        { version: { not: version } },
                        { model: { not: model } }
                    ]
                },
                take: limit - (relatedVehiclesByVersion.length + relatedVehiclesByModel.length),
                include: { VehicleImage: true, make: true, store: true }
            });
        }

        const relatedVehicles = [
            ...relatedVehiclesByVersion,
            ...relatedVehiclesByModel,
            ...relatedVehiclesByBrand
        ];

        return relatedVehicles;
    }
}
