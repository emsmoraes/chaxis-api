import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StoreVehiclesService } from './store-vehicles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('StoreVehicles')
@Controller('store-vehicles')
export class StoreVehiclesController {
    constructor(private readonly storeVehiclesService: StoreVehiclesService) { }

    @Get()
    findAll(
        @Query('storeId') storeId?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('brand') brand?: string,
        @Query('yearMin') yearMin?: number,
        @Query('yearMax') yearMax?: number,
        @Query('priceMin') priceMin?: number,
        @Query('priceMax') priceMax?: number,
        @Query('mileageMin') mileageMin?: number,
        @Query('mileageMax') mileageMax?: number,
        @Query('transmission') transmission?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
        @Query('searchTerm') searchTerm?: string
    ) {
        return this.storeVehiclesService.findAll({
            storeId,
            page,
            limit,
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
        });
    }

}
