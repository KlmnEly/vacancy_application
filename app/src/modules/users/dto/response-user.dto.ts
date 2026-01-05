export class UserResponseDto {
  idUser: number;
  fullname: string;
  email: string;
  created_at: Date;
  role: {
    idRole: number;
    name: string;
  };
}