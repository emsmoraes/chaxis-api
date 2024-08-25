import { Controller, Get, Post, Body, Patch, Param, Delete, MaxFileSizeValidator, FileTypeValidator, UploadedFile, ParseFilePipe, UseInterceptors } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger"

import { DealershipService } from './dealership.service';
import { CreateDealershipDto } from './dto/create-dealership.dto';
import { UpdateDealershipDto } from './dto/update-dealership.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Dealership')
@Controller('dealerships')
export class DealershipController {
    constructor(private readonly dealershipService: DealershipService,
        private readonly awsService: AwsService,
        private readonly prisma: PrismaService) { }

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
    @UseInterceptors(FileInterceptor('photo'))
    async update(
        @Param('id') id: string,
        @Body() updateDealershipDto: UpdateDealershipDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 100000 }),
                    new FileTypeValidator({
                        fileType: /^(image\/jpeg|image\/png|image\/gif|image\/svg\+xml)$/
                    })
                ],
                fileIsRequired: false
            })
        ) file: Express.Multer.File
    ) {
        const updatedDealership = await this.dealershipService.update(id, updateDealershipDto);

        const existingFile = await this.prisma.file.findFirst({
            where: { dealershipId: id, fileType: 'DEALERSHIP_PHOTO' }
        });

        if (existingFile) {
            const folder = 'DEALERSHIP_PHOTOS';
            await this.awsService.delete(existingFile.id, folder);

            await this.prisma.file.delete({ where: { id: existingFile.id } });
        }

        if (file) {
            const fileRecord = await this.prisma.file.create({
                data: {
                    fileType: 'DEALERSHIP_PHOTO',
                    dealershipId: id,
                }
            });

            const folder = 'DEALERSHIP_PHOTOS';
            const photoUrl = await this.awsService.post(fileRecord.id, file.buffer, folder);

            await this.prisma.file.update({
                where: { id: fileRecord.id },
                data: { url: photoUrl }
            });

            await this.prisma.dealership.update({
                where: { id },
                data: {
                    File: {
                        connect: { id: fileRecord.id }
                    }
                }
            });
        }

        return updatedDealership;
    }

    @Delete(':id')
    async remove(@Param('id') id: string,) {
        console.log(id, "AUI")
        const files = await this.prisma.file.findMany({
            where: { dealershipId: id }
        });

        for (const file of files) {
            const folder = 'DEALERSHIP_PHOTOS';
            await this.awsService.delete(file.id, folder);
        }

        await this.prisma.file.deleteMany({
            where: { dealershipId: id }
        });

        return this.prisma.dealership.delete({
            where: { id }
        });
    }
}
