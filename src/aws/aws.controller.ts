import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
    constructor(private readonly uploadService: AwsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 10000 }),
                new FileTypeValidator({
                    fileType: /^(image\/jpeg|image\/png|image\/gif|image\/svg\+xml)$/
                })
            ]
        })
    ) file: Express.Multer.File) {
        await this.uploadService.post(file.originalname, file.buffer, "teste")
    }
}
