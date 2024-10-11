import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class StoreVehiclesService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll({
        storeId,
        page = 1,
        limit = 10,
        brand,
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
        storeId?: string;
        page?: number;
        limit?: number;
        brand?: string;
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

        const where: Prisma.VehicleWhereInput = {
            AND: [
                storeId ? { storeId } : undefined, 
                brand ? { make: { name: { contains: brand, mode: Prisma.QueryMode.insensitive } } } : undefined,
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
                include: { VehicleImage: true, store: true, make: true },
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

}
