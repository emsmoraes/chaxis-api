import { IsString, IsUUID, IsInt, IsArray, IsBoolean, IsDecimal, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateVehicleDto {
    @ApiProperty({ example: "Best Car Model" })
    @IsString()
    model: string;

    @ApiProperty({ example: "vehicleType-uuid" })
    @IsUUID()
    vehicleTypeId: string;

    @ApiProperty({ example: "ABC123" })
    @IsString()
    code: string;

    @ApiProperty({ example: "2.0 Turbo" })
    @IsString()
    version: string;

    @ApiProperty({ example: "2024" })
    @IsString()
    year: string;

    @ApiProperty({ example: 15000 })
    @IsString()
    mileage: string;

    @ApiProperty({ example: "Automatic" })
    @IsString()
    transmission: string;

    @ApiProperty({ example: "bodyType-uuid" })
    @IsUUID()
    bodyTypeId: string;

    @ApiProperty({ example: "Petrol" })
    @IsString()
    fuelType: string;

    @ApiProperty({ example: "XYZ" })
    @IsString()
    licensePlateEnd: string;

    @ApiProperty({ example: "Red" })
    @IsString()
    color: string;

    @ApiProperty({ example: 19999.99 })
    @IsDecimal({ decimal_digits: '2' })
    price: string;

    @ApiProperty({ example: true })
    @IsString()
    acceptsTrade: string;

    @ApiProperty({ example: ["Sunroof", "Leather Seats"] })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({ example: "store-uuid" })
    @IsUUID()
    storeId: string;

    @ApiProperty({ example: "brand-uuid" })
    @IsUUID()
    makeId: string;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @IsString()
    doors?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsString()
    hasGnvKit?: string;

    @ApiPropertyOptional({ example: "150 HP" })
    @IsOptional()
    @IsString()
    enginePower?: string;

    @ApiPropertyOptional({ example: "Hydraulic" })
    @IsOptional()
    @IsString()
    steeringType?: string;
}
