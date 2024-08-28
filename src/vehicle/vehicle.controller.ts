import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags } from '@nestjs/swagger';
import { AwsService } from 'src/aws/aws.service';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

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
                const uuid = uuidv4();
                const fileName = `${uuid}.${fileExtension}`;

                const photoUrl = await this.awsService.post(fileName, file.buffer, 'VEHICLE_PHOTOS');

                await this.prisma.vehicleImage.create({
                    data: {
                        id: uuid,
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
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('makeId') makeId?: string,
        @Query('yearMin') yearMin?: number,
        @Query('yearMax') yearMax?: number,
        @Query('priceMin') priceMin?: number,
        @Query('priceMax') priceMax?: number,
        @Query('mileageMin') mileageMin?: number,
        @Query('mileageMax') mileageMax?: number,
        @Query('transmission') transmission?: string
    ) {
        return this.vehicleService.findAll({
            page,
            limit,
            makeId,
            yearMin,
            yearMax,
            priceMin,
            priceMax,
            mileageMin,
            mileageMax,
            transmission,
        });
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
                const uuid = uuidv4();
                const fileName = `${uuid}.${fileExtension}`;

                const photoUrl = await this.awsService.post(fileName, file.buffer, 'VEHICLE_PHOTOS');

                await this.prisma.vehicleImage.create({
                    data: {
                        id: uuid,
                        position,
                        url: photoUrl,
                        extension: fileExtension,
                        vehicleId: updatedVehicle.id
                    }
                });
            }
        }


        if (transformedDto.imagesToDelete && Array.isArray(transformedDto.imagesToDelete)) {
            for (const imageId of transformedDto.imagesToDelete) {
                const image = await this.prisma.vehicleImage.findUnique({ where: { id: imageId } });
                if (image) {
                    const fileName = `${image.id}.${image.extension}`;
                    await this.awsService.delete(fileName, 'VEHICLE_PHOTOS');

                    await this.prisma.vehicleImage.delete({ where: { id: imageId } });
                }
            }
        }

        return updatedVehicle;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const vehicleImages = await this.prisma.vehicleImage.findMany({
            where: { vehicleId: id }
        });

        for (const image of vehicleImages) {
            const fileName = `${image.id}.${image.extension}`;

            await this.awsService.delete(fileName, 'VEHICLE_PHOTOS');

            await this.prisma.vehicleImage.delete({
                where: { id: image.id }
            });
        }

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
