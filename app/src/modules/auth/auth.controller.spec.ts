import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(dto => ({ idUser: 1, ...dto })),
    login: jest.fn(dto => ({ user_token: 'token', user: { id: 1, email: dto.email } })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register should call service.register', async () => {
    const dto = { email: 'a@a.com' } as any;
    const res = await controller.register(dto);
    expect(res).toEqual({ idUser: 1, ...dto });
  });

  it('login should call service.login and return token', async () => {
    const dto = { email: 'a@a.com', password: 'p' } as any;
    const res = await controller.login(dto);
    expect(res).toHaveProperty('user_token', 'token');
  });
});
