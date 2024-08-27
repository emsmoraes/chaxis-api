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
    @UseInterceptors(FilesInterceptor('newImages', 10))
    async update(
        @Param('id') id: string,
        @Body() updateVehicleDto: UpdateVehicleDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const transformedDto = this.transformDto(updateVehicleDto);

        const updatedVehicle = await this.vehicleService.update(id, transformedDto);

        if (transformedDto.existingImages && Array.isArray(transformedDto.existingImages)) {
            for (const image of transformedDto.existingImages) {
                await this.prisma.vehicleImage.update({
                    where: { id: image.id },
                    data: { position: Number(image.position) }
                });
            }
        }

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const dtoPosition = transformedDto.newImages[i]?.position;
                const position = dtoPosition !== undefined ? Number(dtoPosition) : (updateVehicleDto.existingImages ? updateVehicleDto.existingImages.length + i : i);

                const fileExtension = file.originalname.split('.').pop();
                const fileName = `${updatedVehicle.id}_${position}.${fileExtension}`;

                const photoUrl = await this.awsService.post(fileName, file.buffer, 'VEHICLE_PHOTOS');

                await this.prisma.vehicleImage.create({
                    data: {
                        position,
                        url: photoUrl,
                        extension: fileExtension,
                        vehicleId: updatedVehicle.id
                    }
                });
            }
        }

        return updatedVehicle;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehicleService.remove(id);
    }

    private transformDto(dto: Record<string, any>): any {
        const result: any = {};

        for (const key in dto) {
            if (Object.prototype.hasOwnProperty.call(dto, key)) {
                const value = dto[key];
                const keys = key.split(/[\[\]\.]+/).filter(k => k);
                let current = result;

                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i];
                    if (!current[k]) {
                        current[k] = i === keys.length - 1 ? value : {};
                    }
                    current = current[k];
                }
            }
        }

        if (Array.isArray(result.existingImages)) {
        } else if (typeof result.existingImages === 'object') {
            result.existingImages = Object.keys(result.existingImages).map(key => result.existingImages[key]);
        }

        return result;
    }
}
