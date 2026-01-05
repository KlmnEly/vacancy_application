import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register Endpoint
  // auth/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register (@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // Login Endpoint
  // auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login (@Body() loginDto: LoginDto) {
    // If login is successful, return the JWT token
    return this.authService.login(loginDto);
  }

}
