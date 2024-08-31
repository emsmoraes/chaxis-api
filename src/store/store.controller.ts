import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AwsService } from 'src/aws/aws.service';
import { StoreService } from './store.service';

@ApiTags('Store')
@Controller('stores')
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
        private readonly awsService: AwsService,
        private readonly prisma: PrismaService
    ) { }

    @Post()
    create(@Body() createStoreDto: CreateStoreDto) {
        return this.storeService.create(createStoreDto);
    }

    @Get()
    findAll(
        @Query('name') name?: string,
        @Query('state') state?: string,
        @Query('city') city?: string,
    ) {
        return this.storeService.findAll({ name, state, city });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storeService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'photo', maxCount: 1 },
            { name: 'banner', maxCount: 1 },
        ])
    )
    async update(
        @Param('id') id: string,
        @Body() updateStoreDto: UpdateStoreDto,
        @UploadedFiles()
        files: {
            photo?: Express.Multer.File[];
            banner?: Express.Multer.File[];
        },
    ) {
        const updatedStore = await this.storeService.update(id, updateStoreDto);

        const fileOperations = [];

        if (files?.photo && files?.photo.length > 0) {
            const existingPhotoFile = await this.prisma.file.findFirst({
                where: { storeId: id, fileType: 'STORE_PHOTO' }
            });

            if (existingPhotoFile) {
                const folder = 'STORE_PHOTOS';
                await this.awsService.delete(`${existingPhotoFile.id}.${existingPhotoFile.extension}`, folder);
                await this.prisma.file.delete({ where: { id: existingPhotoFile.id } });
            }

            const photoRecord = await this.prisma.file.create({
                data: {
                    fileType: 'STORE_PHOTO',
                    storeId: id,
                }
            });

            const fileExtension = files.photo[0].originalname.split('.').pop();
            const fileName = `${photoRecord.id}.${fileExtension}`

            const photoUrl = await this.awsService.post(fileName, files.photo[0].buffer, 'STORE_PHOTOS');
            await this.prisma.file.update({
                where: { id: photoRecord.id },
                data: { url: photoUrl, extension: fileExtension }
            });

            fileOperations.push(
                this.prisma.store.update({
                    where: { id },
                    data: {
                        file: {
                            connect: { id: photoRecord.id }
                        }
                    }
                })
            );
        }

        if (files?.banner && files?.banner.length > 0) {
            const existingBannerFile = await this.prisma.file.findFirst({
                where: { storeId: id, fileType: 'STORE_BANNER' }
            });

            if (existingBannerFile) {
                const folder = 'STORE_BANNERS';
                await this.awsService.delete(`${existingBannerFile.id}.${existingBannerFile.extension}`, folder);
                await this.prisma.file.delete({ where: { id: existingBannerFile.id } });
            }

            const bannerRecord = await this.prisma.file.create({
                data: {
                    fileType: 'STORE_BANNER',
                    storeId: id,
                }
            });

            const fileExtension = files.banner[0].originalname.split('.').pop();
            const fileName = `${bannerRecord.id}.${fileExtension}`

            const bannerUrl = await this.awsService.post(fileName, files.banner[0].buffer, 'STORE_BANNERS');
            await this.prisma.file.update({
                where: { id: bannerRecord.id },
                data: { url: bannerUrl, extension: fileExtension }
            });

            fileOperations.push(
                this.prisma.store.update({
                    where: { id },
                    data: {
                        file: {
                            connect: { id: bannerRecord.id }
                        }
                    }
                })
            );
        }

        await Promise.all(fileOperations);

        return updatedStore;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.storeService.remove(id);
    }
}
