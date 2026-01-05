import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    createUser: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should call usersService.createUser and return', async () => {
      const dto = { email: 'a@a.com' } as any;
      mockUsersService.createUser.mockResolvedValue({ idUser: 1 });
      const res = await service.register(dto);
      expect(res).toEqual({ idUser: 1 });
    });

    it('should rethrow ConflictException from usersService', async () => {
      mockUsersService.createUser.mockRejectedValue(new ConflictException());
      await expect(service.register({} as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw Unauthorized when user not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'a', password: 'p' } as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized when password does not match', async () => {
      const user = { idUser: 1, email: 'a', password: bcrypt.hashSync('other'), role: { name: 'USER' } } as any;
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      await expect(service.login({ email: 'a', password: 'p' } as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should return token and user on success', async () => {
      const user = { idUser: 2, email: 'a', password: bcrypt.hashSync('p'), role: { name: 'USER' } } as any;
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      const res = await service.login({ email: 'a', password: 'p' } as any);
      expect(res).toHaveProperty('user_token', 'token');
      expect(res.user).toHaveProperty('id', 2);
    });
  });
});
