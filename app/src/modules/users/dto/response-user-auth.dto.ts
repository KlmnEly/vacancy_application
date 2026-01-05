export interface UserAuthResponseDto {
    idUser: number;
    fullname: string;
    email: string;
    password: string;
    role: {
        idRole: number;
        name: string;
    };
}
