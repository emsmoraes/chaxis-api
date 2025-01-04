import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModule as ConfigModuleNest } from "@nestjs/config"

import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { DealershipModule } from './dealership/dealership.module';
import { PrismaModule } from './shared/database/prisma.module';
import { StoreModule } from './store/store.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { AwsModule } from './aws/aws.module';
import { BrandModule } from './brand/brand.module';
import { BodyTypeModule } from './body-type/body-type.module';
import { StoreVehiclesModule } from './store-vehicles/store-vehicles.module';
import { RelatedVehiclesModule } from './related-vehicles/related-vehicles.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';

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
        VehicleModule,
        AwsModule,
        ConfigModule.forRoot({ isGlobal: true }),
        BrandModule,
        BodyTypeModule,
        StoreVehiclesModule,
        RelatedVehiclesModule,
        VehicleTypeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
