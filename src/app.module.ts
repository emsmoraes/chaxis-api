import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from "@nestjs/config"

import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';

@Module({
    imports: [
        ConfigModuleNest.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        EnvModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
