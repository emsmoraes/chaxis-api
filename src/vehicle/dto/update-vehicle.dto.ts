import { IsString, IsOptional, IsUUID, IsInt, IsEnum, IsArray, IsBoolean, IsDecimal, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { vehicleType } from "src/shared/enum/vehicle-type";

export class UpdateVehicleDto {
    @ApiProperty({ example: "Best Car Model", required: false })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiProperty({ example: vehicleType.CAR, required: false })
    @IsEnum(vehicleType)
    @IsOptional()
    type?: vehicleType;

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
    @IsInt()
    @IsOptional()
    mileage?: number;

    @ApiProperty({ example: "Automatic", required: false })
    @IsString()
    @IsOptional()
    transmission?: string;

    @ApiProperty({ example: "Sedan", required: false })
    @IsString()
    @IsOptional()
    bodyType?: string;

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
    @IsBoolean()
    @IsOptional()
    acceptsTrade?: boolean;

    @ApiProperty({ example: ["Sunroof", "Leather Seats"], required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    features?: string[];

    @ApiProperty({ example: "brand-uuid", required: false })
    @IsString()
    @IsOptional()
    makeId?: string;
}
