import { Controller, Get } from '@nestjs/common';
import { VehicleTypeService } from './vehicle-type.service';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@ApiTags('Vehicle types')
@Controller('vehicle-type')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService,
    private readonly prisma: PrismaService
  ) { }

  @Get()
  async findAll() {
    return this.vehicleTypeService.findAll();
  }
}
