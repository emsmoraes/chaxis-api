import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BodyTypeService } from './body-type.service';

@Controller('/body-types')
export class BodyTypeController {
  constructor(private readonly bodyTypeService: BodyTypeService) {}

  @Get()
  findAll() {
    return this.bodyTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bodyTypeService.findOne(+id);
  }
}
