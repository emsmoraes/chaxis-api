import { IsString, IsOptional, IsArray, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDealershipDto {
    @ApiProperty({ example: "Best Cars Dealership", required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: "Leading dealership in the city offering the best deals.", required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: ["store-uuid1", "store-uuid2"], required: false })
    @IsArray()
    @IsUUID("4", { each: true })
    @IsOptional()
    stores?: string[];

    @ApiProperty({ example: new Date().toISOString(), required: false })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: new Date().toISOString(), required: false })
    @IsOptional()
    updatedAt?: Date;
}
