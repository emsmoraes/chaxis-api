import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const envService = app.get(EnvService)

    const port = envService.get("PORT")

    const config = new DocumentBuilder()
        .setTitle('Chaxis api')
        .setDescription('Api de busca de veículos ideais em sua região')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);
}
bootstrap();
