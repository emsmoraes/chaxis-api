import { IsString, IsOptional, IsArray, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDealershipDto {
    @ApiProperty({ example: "Best Cars Dealership" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Leading dealership in the city offering the best deals." })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: ["store-uuid1", "store-uuid2"] })
    @IsArray()
    @IsUUID("4", { each: true })
    @IsOptional()
    stores?: string[];

    @ApiProperty({ example: new Date().toISOString() })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date().toISOString() })
    @IsOptional()
    updatedAt?: Date;
}
