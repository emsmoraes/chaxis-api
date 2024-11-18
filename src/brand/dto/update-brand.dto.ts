import { IsString, IsOptional, IsArray, IsUUID, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBrandDto {
    @ApiProperty({ example: "VW - Volkswagen", required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: "Volkswagen", required: false })
    @IsString()
    @IsOptional()
    alias?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    visible?: false;
}
