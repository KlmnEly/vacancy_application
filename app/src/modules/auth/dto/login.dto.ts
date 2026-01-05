import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
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
}
