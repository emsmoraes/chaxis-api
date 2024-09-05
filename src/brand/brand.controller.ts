import { Controller, Get } from '@nestjs/common';
import { BrandService } from './brand.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Controller('brands')
export class BrandController {
    constructor(
        private readonly brandService: BrandService,
    ) { }

    @Get()
    findAll() {
        return this.brandService.findAll();
    }
}
