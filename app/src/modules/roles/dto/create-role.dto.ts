import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRoleDto {
    @ApiProperty({
    description: 'Role name',
    example: 'CODER',
    minLength: 3,
  })
    @IsNotEmpty({ message: 'the role name is required' })
    @IsString({ message: 'the role name must be a string' })
    @MinLength(3, { message : 'the role name must have at least 3 characters' })
    name: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}