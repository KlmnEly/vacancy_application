// roles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  // Creamos el objeto con las funciones simuladas
  const mockRoleRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          // vinculamos el token del repositorio al mock
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  // Limpiamos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA DE CREACIÓN ---
  describe('createRole', () => {
    it('should throw ConflictException if role already exists', async () => {
      const dto = { name: 'ADMIN' };
      // Simulamos que el repositorio encuentra un rol existente
      mockRoleRepository.findOne.mockResolvedValue({ id_role: '1', name: 'ADMIN' });

      await expect(service.createRole(dto)).rejects.toThrow(ConflictException);
    });

    it('should create and return a new role', async () => {
      const dto = { name: 'NEW_ROLE' };
      mockRoleRepository.findOne.mockResolvedValue(null); // No existe
      mockRoleRepository.create.mockReturnValue(dto);
      mockRoleRepository.save.mockResolvedValue({ id_role: 'uuid', ...dto });

      const result = await service.createRole(dto);

      expect(result).toHaveProperty('id_role');
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  // --- PRUEBA DE BÚSQUEDA POR ID ---
  describe('getById', () => {
    it('should throw NotFoundException if role does not exist', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);

      await expect(service.getById('invalid-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return a role if it exists', async () => {
      const expectedRole = { id_role: 'uuid', name: 'ADMIN', isActive: true };
      mockRoleRepository.findOne.mockResolvedValue(expectedRole);

      const result = await service.getById('uuid');
      expect(result).toEqual(expectedRole);
    });
  });
});