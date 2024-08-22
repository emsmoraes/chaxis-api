import { PrismaClient } from '@prisma/client';
import { Brands } from '../src/shared/utils/brands';

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
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
