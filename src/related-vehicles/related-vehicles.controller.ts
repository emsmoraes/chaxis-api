import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RelatedVehiclesService } from './related-vehicles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('RelatedVehicles')
@Controller('related-vehicles')
export class RelatedVehiclesController {
  constructor(private readonly relatedVehiclesService: RelatedVehiclesService) {}

  @Get(':vehicleId')
  findOne(@Param('vehicleId') id: string,
  @Query('limit') limit: number = 5,) {

    return this.relatedVehiclesService.findOne(id, +limit);

  }
}
