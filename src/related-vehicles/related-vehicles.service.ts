import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class RelatedVehiclesService {

    constructor(private readonly prisma: PrismaService) { }

    async findOne(vehicleId: string, limit: number) {
        const currentVehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: { bodyType: true }
        });
    
        if (!currentVehicle) {
            throw new Error('Veículo não encontrado');
        }
    
        // Calcula o intervalo de preço (15% para mais e para menos)
        const minPrice = currentVehicle.price as any * 0.85;
        const maxPrice = currentVehicle.price as any * 1.15;
    
        // Busca veículos relacionados com base no BodyType e faixa de preço
        const relatedVehicles = await this.prisma.vehicle.findMany({
            where: {
                AND: [
                    { bodyTypeId: currentVehicle.bodyTypeId },
                    { price: { gte: minPrice, lte: maxPrice } },
                    { id: { not: vehicleId } }
                ]
            },
            take: limit,
            include: { VehicleImage: true, make: true, store: true }
        });
    
        return relatedVehicles;
    }
}
