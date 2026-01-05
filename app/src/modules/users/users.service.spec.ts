import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw ConflictException when email exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ email: 'a@a.com' });
      await expect(service.createUser({} as any)).rejects.toThrow(ConflictException);
    });

    it('should create a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      // use real bcrypt to hash password during createUser
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockResolvedValue({ idUser: 1 });
      mockUserRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ idUser: 1, role: { idRole: 1, name: 'USER' } });

      const res = await service.createUser({ email: 'a@a.com', password: 'p' } as any);
      expect(res).toHaveProperty('idUser');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllUsers', () => {
    it('should return mapped users', async () => {
      const users = [{ idUser: 1, fullname: 'n', email: 'e', createdAt: new Date(), role: { idRole: 1, name: 'R' } }];
      mockUserRepository.find.mockResolvedValue(users as any);
      const res = await service.findAllUsers();
      expect(res).toEqual(expect.any(Array));
    });
  });

  describe('findOneById', () => {
    it('should throw NotFoundException when not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneById(99)).rejects.toThrow(NotFoundException);
    });

    it('should return a mapped user', async () => {
      const user = { idUser: 2, fullname: 'n', email: 'e', createdAt: new Date(), role: { idRole: 1, name: 'R' } } as any;
      mockUserRepository.findOne.mockResolvedValue(user);
      const res = await service.findOneById(2);
      expect(res).toHaveProperty('idUser', 2);
    });
  });

  describe('findOneByEmail', () => {
    it('should throw NotFoundException when not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByEmail('no@e.com')).rejects.toThrow(NotFoundException);
    });

    it('should return user auth dto', async () => {
      const user = { idUser: 3, fullname: 'n', email: 'e', password: 'p', role: { idRole: 1, name: 'R' } } as any;
      mockUserRepository.findOne.mockResolvedValue(user);
      const res = await service.findOneByEmail('e');
      expect(res).toHaveProperty('password', 'p');
    });
  });
});
