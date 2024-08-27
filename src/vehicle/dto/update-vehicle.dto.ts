import { IsString, IsOptional, IsUUID, IsInt, IsArray, IsBoolean, IsDecimal, ValidateNested } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from 'class-transformer';
class UpdateVehicleExistingImageDto {
    @ApiPropertyOptional({ description: 'UUID da imagem existente' })
    @IsUUID()
    id: string;

    @ApiPropertyOptional({ description: 'Posição da imagem' })
    @IsInt()
    position: string;
}

export class UpdateVehicleDto {
    @ApiProperty({ example: "Best Car Model", required: false })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiProperty({ example: "vehicleType-uuid", required: false })
    @IsUUID()
    @IsOptional()
    vehicleTypeId?: string;

    @ApiProperty({ example: "ABC123", required: false })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ example: "2.0 Turbo", required: false })
    @IsString()
    @IsOptional()
    version?: string;

    @ApiProperty({ example: "2024", required: false })
    @IsString()
    @IsOptional()
    year?: string;

    @ApiProperty({ example: 15000, required: false })
    @IsString()
    @IsOptional()
    mileage?: string;

    @ApiProperty({ example: "Automatic", required: false })
    @IsString()
    @IsOptional()
    transmission?: string;

    @ApiProperty({ example: "bodyType-uuid", required: false })
    @IsUUID()
    @IsOptional()
    bodyTypeId?: string;

    @ApiProperty({ example: "Petrol", required: false })
    @IsString()
    @IsOptional()
    fuelType?: string;

    @ApiProperty({ example: "XYZ", required: false })
    @IsString()
    @IsOptional()
    licensePlateEnd?: string;

    @ApiProperty({ example: "Red", required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 19999.99, required: false })
    @IsDecimal({ decimal_digits: '2' })
    @IsOptional()
    price?: string;

    @ApiProperty({ example: true, required: false })
    @IsString()
    @IsOptional()
    acceptsTrade?: string;

    @ApiProperty({ example: ["Sunroof", "Leather Seats"], required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    features?: string[];

    @ApiProperty({ example: "store-uuid", required: false })
    @IsUUID()
    @IsOptional()
    storeId?: string;

    @ApiProperty({ example: "brand-uuid", required: false })
    @IsUUID()
    @IsOptional()
    makeId?: string;

    @ApiProperty({ example: [{ id: "image-uuid", position: 2 }], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateVehicleExistingImageDto)
    @IsOptional()
    existingImages?: UpdateVehicleExistingImageDto[];
}
