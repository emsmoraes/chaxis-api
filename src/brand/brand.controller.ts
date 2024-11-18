import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { BrandService } from './brand.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandController {
    constructor(
        private readonly brandService: BrandService,
    ) { }

    @Get()
    findAll() {
        return this.brandService.findAll();
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto
    ) {
        return this.brandService.update(id, updateBrandDto)
    }
}
