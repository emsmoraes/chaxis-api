import { IsString, IsOptional, IsUUID, IsDateString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStoreDto {
    @ApiProperty({ example: "Best Store in Town" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Leading store with the best offers in town." })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: "123 Main St" })
    @IsString()
    address: string;

    @ApiProperty({ example: "31982623783" })
    @IsString()
    phone: string;

    @ApiProperty({ example: "Metropolis" })
    @IsString()
    city: string;

    @ApiProperty({ example: "NY" })
    @IsString()
    state: string;

    @ApiProperty({ example: "10001" })
    @IsString()
    postalCode: string;

    @ApiProperty({ example: "USA" })
    @IsString()
    country: string;

    @ApiProperty({ example: "40.7128" })
    @IsString()
    latitude: string;

    @ApiProperty({ example: "-74.0060" })
    @IsString()
    longitude: string;

    @ApiProperty({ example: "dealership-uuid" })
    @IsUUID()
    dealershipId: string;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDateString()
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDateString()
    @IsOptional()
    updatedAt?: Date;
}
