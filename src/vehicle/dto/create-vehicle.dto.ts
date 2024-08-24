import { IsString, IsUUID, IsInt, IsArray, IsBoolean, IsDecimal } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
    @IsInt()
    mileage: number;

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
    @IsBoolean()
    acceptsTrade: boolean;

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
}
