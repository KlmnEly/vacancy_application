import { Role } from "src/common/enums/role.enum";

export interface Payload {
  email: string;
  sub: number; // User ID
  role: Role; // Roles enum
  iat: number; // Issued at (create at)
  exp: number; // Expiration (expire at)
}