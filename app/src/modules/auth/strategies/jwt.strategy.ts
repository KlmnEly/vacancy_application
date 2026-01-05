import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../interfaces/payload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
  ) {
    // Configuration for the JWT strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Show where to extract the JWT (header Bearer)
      ignoreExpiration: false, // Token expiration should ve validated
      secretOrKey: process.env.JWT_SECRET, 
    });
  }

  // Validate method called automatically by Passport to validate the token
  async validate(payload: Payload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token invalido')
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    }; 
  }
}