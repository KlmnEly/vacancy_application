import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRolesService = {
    createRole: jest.fn(dto => ({
      id_role: 'uuid-test',
      ...dto,
      createdAt: new Date()
    })),
    getById: jest.fn(id => ({
      id_role: id,
      name: 'ADMIN',
      isActive: true
    }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService
        }
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Prueba del método Create
  describe('create', () => {
    it('should create a new role', async () => {
      const dto: CreateRoleDto = { name: 'VET', isActive: true };
      
      const result = await controller.create(dto);

      expect(result).toEqual({
        id_role: 'uuid-test',
        name: 'VET',
        isActive: true,
        createdAt: expect.any(Date),
      });
      expect(service.createRole).toHaveBeenCalledWith(dto);
    });
  });

  // Prueba del método FindOne
  describe('findOne', () => {
    it('should return a role by id', async () => {
      const id = 1;
      const result = await controller.findOne(id);

      expect(result).toEqual({
        id_role: id,
        name: 'ADMIN',
        isActive: true,
      });
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });
});
