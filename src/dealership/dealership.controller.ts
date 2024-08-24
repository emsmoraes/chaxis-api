import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger"

import { DealershipService } from './dealership.service';
import { CreateDealershipDto } from './dto/create-dealership.dto';
import { UpdateDealershipDto } from './dto/update-dealership.dto';

@ApiTags('Dealership')
@Controller('dealerships')
export class DealershipController {
    constructor(private readonly dealershipService: DealershipService) { }

    @Post()
    create(@Body() createDealershipDto: CreateDealershipDto) {
        return this.dealershipService.create(createDealershipDto);
    }

    @Get()
    findAll() {
        return this.dealershipService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dealershipService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDealershipDto: UpdateDealershipDto) {
        return this.dealershipService.update(id, updateDealershipDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.dealershipService.remove(id);
    }
}
