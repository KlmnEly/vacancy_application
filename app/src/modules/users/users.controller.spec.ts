import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAllUsers: jest.fn(() => []),
    findOneById: jest.fn(id => ({ idUser: id })),
    findOneByEmail: jest.fn(email => ({ email })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array', async () => {
      const res = await controller.findAll();
      expect(res).toEqual([]);
      expect(service.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return user by id', async () => {
      const res = await controller.findOneById('5');
      expect(res).toEqual({ idUser: 5 });
      expect(service.findOneById).toHaveBeenCalledWith(5);
    });
  });

  describe('findOneByEmail', () => {
    it('should return user by email', async () => {
      const res = await controller.findOneByEmail('a@a.com');
      expect(res).toEqual({ email: 'a@a.com' });
      expect(service.findOneByEmail).toHaveBeenCalledWith('a@a.com');
    });
  });
});
