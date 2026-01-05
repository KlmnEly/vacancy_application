// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';

// Key used to store roles metadata
export const ROLES_KEY = 'roles'; 

/**
 * Decorator to specify roles allowed to access a route (route/class)
 * * @param roles A list of allowed roles (Role.Admin, Role.User)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);