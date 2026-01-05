import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Extends the Passport AuthGuard with the 'jwt' strategy
export class JwtAuthGuard extends AuthGuard('jwt') {}