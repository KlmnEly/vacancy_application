import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'node_modules/bcryptjs';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Register new User
  async register (createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during user registration');
    }
  }

  // Login existing user
  async login (loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT payload (Define what data to include in the token)
    const payload = {
      email: user.email,
      sub: user.idUser,
      role: user.role.name as Role
    };

    // Sign and return the JWT
    return {
      user_token: this.jwtService.sign(payload),
      user: {
        id: user.idUser,
        email: user.email,
        role: user.role.name
      },
    };
  }
}
