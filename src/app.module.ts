import { Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from "@nestjs/config"

import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { DealershipModule } from './dealership/dealership.module';
import { PrismaModule } from './shared/database/prisma.module';
import { StoreModule } from './store/store.module';

@Module({
    imports: [
        ConfigModuleNest.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        EnvModule,
        DealershipModule,
        StoreModule,
        PrismaModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
