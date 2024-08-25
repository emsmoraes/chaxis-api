import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags } from '@nestjs/swagger';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Vehicle')
@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService,
        private readonly awsService: AwsService,
        private readonly prisma: PrismaService
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 10))
    async create(
        @Body() createVehicleDto: CreateVehicleDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const createdVehicle = await this.vehicleService.create(createVehicleDto);

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const position = i;

                const fileExtension = file.originalname.split('.').pop();
                const fileName = `${createdVehicle.id}_${position}.${fileExtension}`;

                const photoUrl = await this.awsService.post(fileName, file.buffer, 'VEHICLE_PHOTOS');

                await this.prisma.vehicleImage.create({
                    data: {
                        position,
                        url: photoUrl,
                        extension: fileExtension,
                        vehicleId: createdVehicle.id
                    }
                });
            }
        }

        return createdVehicle;
    }

    @Get()
    findAll() {
        return this.vehicleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehicleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
        return this.vehicleService.update(id, updateVehicleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehicleService.remove(id);
    }
}
