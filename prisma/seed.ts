import { PrismaClient } from '@prisma/client';
import { Brands } from '../src/shared/utils/brands';
import { BodyTypes } from '../src/shared/utils/body-types';
import { VehicleTypes } from '../src/shared/utils/vehicle-types';

const prisma = new PrismaClient();

async function main() {
    const vehicleTypeIds = [];
    const bodyTypeIds = [];
    const brandIds = [];

    for (const brand of Brands) {
        const createdBrand = await prisma.brand.upsert({
            where: { code: brand.codigo },
            update: {},
            create: {
                name: brand.nome,
                code: brand.codigo,
                alias: brand.nome.toLowerCase().replace(/\s+/g, '_')
            },
        });
        brandIds.push(createdBrand.id);
    }

    for (const bodyType of BodyTypes) {
        const createdBodyType = await prisma.bodyType.upsert({
            where: { name: bodyType.name },
            update: {},
            create: {
                name: bodyType.name,
                alias: bodyType.name.toLowerCase().replace(/\s+/g, '_')
            },
        });
        bodyTypeIds.push(createdBodyType.id);
    }

    for (const vehicleType of VehicleTypes) {
        const createdVehicleType = await prisma.vehicleType.upsert({
            where: { name: vehicleType.name },
            update: {},
            create: {
                name: vehicleType.name,
                alias: vehicleType.name.toLowerCase().replace(/\s+/g, '_')
            },
        });
        vehicleTypeIds.push(createdVehicleType.id);
    }

    // const dealership = await prisma.dealership.create({
    //     data: {
    //         name: "Minha nova",
    //         description: "Leading dealership in the city offering the best deals."
    //     }
    // });

    // const store = await prisma.store.create({
    //     data: {
    //         name: "Best Store in Town",
    //         description: "Leading store with the best offers in town.",
    //         address: "123 Main St",
    //         phone: "31982623783",
    //         city: "Metropolis",
    //         state: "NY",
    //         postalCode: "10001",
    //         country: "USA",
    //         dealershipId: dealership.id,
    //     }
    // });

    // for (let i = 0; i < 50; i++) {
    //     try {
    //         await prisma.vehicle.create({
    //             data: {
    //                 model: `Model ${i + 1}`,
    //                 typeId: vehicleTypeIds[i % vehicleTypeIds.length],
    //                 code: `CODE${i + 1}`,
    //                 searchTerm: `Model ${i + 1} Elegance`,
    //                 version: "Elegance",
    //                 year: "2024",
    //                 mileage: 15000,
    //                 transmission: "Automatic",
    //                 bodyTypeId: bodyTypeIds[i % bodyTypeIds.length],
    //                 fuelType: "Petrol",
    //                 licensePlateEnd: `XYZ${i + 1}`,
    //                 color: "Red",
    //                 price: 19999.13,
    //                 acceptsTrade: true,
    //                 features: {
    //                     set: ["Sunroof", "Leather Seats"]
    //                 },
    //                 storeId: store.id,
    //                 makeId: brandIds[i % brandIds.length],
    //             }
    //         });
    //     } catch (error) {
    //         console.error(`Error creating vehicle ${i + 1}:`, error);
    //     }
    // }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
