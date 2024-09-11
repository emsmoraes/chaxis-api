import { IsString, IsOptional, IsUUID, IsDateString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateStoreDto } from "./create-store.dto";

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
    @ApiProperty({ example: "Best Store in Town" })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: "Leading store with the best offers in town." })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: "123 Main St" })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: "Metropolis" })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ example: "NY" })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ example: "10001" })
    @IsString()
    @IsOptional()
    postalCode?: string;

    @ApiProperty({ example: "USA" })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: "40.7128" })
    @IsString()
    @IsOptional()
    latitude?: string;

    @ApiProperty({ example: "-74.0060" })
    @IsString()
    @IsOptional()
    longitude?: string;

    @ApiProperty({ example: "dealership-uuid" })
    @IsUUID()
    @IsOptional()
    dealershipId?: string;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDateString()
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDateString()
    @IsOptional()
    updatedAt?: Date;
}
