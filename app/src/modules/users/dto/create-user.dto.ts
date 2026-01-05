import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'full name of the user',
        example: 'Raul Gomez'
    })
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        description: 'user email',
        example: 'user@test.com',
        minLength: 8,
    })
    @IsEmail({}, { message: 'The email is not valid' })
    @IsNotEmpty()
    @MinLength(8, { message: 'The email must have at least 8 characters' })
    email: string;

    @ApiProperty({
        description: 'user password',
        example: '123456',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'The password must have at least 6 characters' })
    password: string;

    @IsOptional()
    @IsNumber()
    roleId: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}