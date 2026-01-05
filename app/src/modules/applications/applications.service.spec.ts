import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { NotFoundException } from '@nestjs/common';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockVacancyRepo = {
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: getRepositoryToken(Application), useValue: mockRepo },
        { provide: getRepositoryToken(Vacancy), useValue: mockVacancyRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get<Repository<Application>>(getRepositoryToken(Application));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return application', async () => {
      const dto: CreateApplicationDto = { userId: 1, vacancyId: 2 } as any;
      mockVacancyRepo.findOne.mockResolvedValue({ idVacancy: 2, maxApplicants: 5 } as any);
      mockUserRepo.findOne.mockResolvedValue({ idUser: 1 } as any);
      mockRepo.count.mockResolvedValue(0);
      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue({ idApplication: 1, ...dto });

      const res = await service.create(dto);
      expect(res).toHaveProperty('idApplication', 1);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw when vacancy at capacity', async () => {
      const dto: CreateApplicationDto = { userId: 1, vacancyId: 2 } as any;
      mockVacancyRepo.findOne.mockResolvedValue({ idVacancy: 2, maxApplicants: 1 } as any);
      mockUserRepo.findOne.mockResolvedValue({ idUser: 1 } as any);
      mockRepo.count.mockResolvedValue(1);

      await expect(service.create(dto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('returns array', async () => {
      mockRepo.find.mockResolvedValue([{ idApplication: 1 } as any]);
      const res = await service.findAll();
      expect(res).toEqual(expect.any(Array));
    });
  });

  describe('findOne', () => {
    it('throws when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('returns when found', async () => {
      const item = { idApplication: 2 } as any;
      mockRepo.findOne.mockResolvedValue(item);
      const res = await service.findOne(2);
      expect(res).toEqual(item);
    });
  });

  describe('update', () => {
    it('updates and returns', async () => {
      mockRepo.update.mockResolvedValue({ affected: 1 } as any);
      mockRepo.findOne.mockResolvedValue({ idApplication: 3 } as any);
      const res = await service.update(3, { appliedAt: '2026-01-01T00:00:00Z' } as any);
      expect(repository.update).toHaveBeenCalled();
      expect(res).toHaveProperty('idApplication', 3);
    });

    it('throws when not found', async () => {
      mockRepo.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.update(4, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes and returns message', async () => {
      mockRepo.findOne.mockResolvedValue({ idApplication: 5 } as any);
      mockRepo.delete.mockResolvedValue({ affected: 1 } as any);
      const res = await service.remove(5);
      expect(repository.delete).toHaveBeenCalledWith({ idApplication: 5 });
      expect(res).toEqual({ message: 'Application with id 5 removed' });
    });

    it('throws when not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(6)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVacanciesByUserEmail', () => {
    it('returns vacancies for a user email', async () => {
      mockUserRepo.findOne.mockResolvedValue({ idUser: 7 } as any);
      mockRepo.find.mockResolvedValue([{ vacancy: { idVacancy: 11 } } as any]);

      const res = await service.getVacanciesByUserEmail('a@a.com');
      expect(res).toEqual([{ idVacancy: 11 }]);
    });

    it('throws when user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.getVacanciesByUserEmail('no@no.com')).rejects.toThrow(NotFoundException);
    });
  });
});
