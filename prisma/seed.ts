import { PrismaClient } from '@prisma/client';
import { Brands } from '../src/shared/utils/brands';
import { BodyTypes } from '../src/shared/utils/body-types';
import { VehicleTypes } from '../src/shared/utils/vehicle-types';

const prisma = new PrismaClient();

async function main() {
    for (const brand of Brands) {
        await prisma.brand.upsert({
            where: { code: brand.codigo },
            update: {},
            create: {
                name: brand.nome,
                code: brand.codigo,
                alias: brand.nome.toLowerCase().replace(/\s+/g, '_')
            },
        });
    }

    for (const bodyType of BodyTypes) {
        await prisma.bodyType.upsert({
            where: { name: bodyType.name },
            update: {},
            create: {
                name: bodyType.name,
                alias: bodyType.name.toLowerCase().replace(/\s+/g, '_')
            },
        });
    }

    for (const vehicleType of VehicleTypes) {
        await prisma.vehicleType.upsert({
            where: { name: vehicleType.name },
            update: {},
            create: {
                name: vehicleType.name,
                alias: vehicleType.name.toLowerCase().replace(/\s+/g, '_')
            },
        });
    }
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
