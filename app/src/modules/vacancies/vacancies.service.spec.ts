import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { NotFoundException } from '@nestjs/common';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;

  const mockVacancyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockVacancyRepository,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    repository = module.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return vacancy', async () => {
      const dto: CreateVacancyDto = {
        title: 'Dev',
        description: 'desc',
        technologies: 'TS',
        seniority: 'Junior',
        softSkills: 'Teamwork',
        location: 'City',
        modality: null as any,
        salaryRange: 1000,
        company: 'Co',
        maxApplicants: 5,
      };

      mockVacancyRepository.create.mockReturnValue(dto);
      mockVacancyRepository.save.mockResolvedValue({ idVacancy: 1, ...dto });

      const res = await service.create(dto);
      expect(res).toHaveProperty('idVacancy', 1);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of vacancies', async () => {
      const items = [{ idVacancy: 1, title: 'x' }];
      mockVacancyRepository.find.mockResolvedValue(items as any);
      const res = await service.findAll();
      expect(res).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when not found', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should return vacancy when found', async () => {
      const item = { idVacancy: 2, title: 'found' } as any;
      mockVacancyRepository.findOne.mockResolvedValue(item);
      const res = await service.findOne(2);
      expect(res).toEqual(item);
    });
  });

  describe('update', () => {
    it('should update and return updated vacancy', async () => {
      const updated = { idVacancy: 3, title: 'updated' } as any;
      mockVacancyRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockVacancyRepository.findOne.mockResolvedValue(updated);

      const res = await service.update(3, { title: 'updated' } as any);
      expect(repository.update).toHaveBeenCalledWith({ idVacancy: 3 }, { title: 'updated' });
      expect(res).toEqual(updated);
    });

    it('should throw NotFoundException when update affects 0 rows', async () => {
      mockVacancyRepository.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.update(4, { title: 'no' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove vacancy and return message', async () => {
      mockVacancyRepository.findOne.mockResolvedValue({ idVacancy: 5 } as any);
      mockVacancyRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const res = await service.remove(5);
      expect(repository.delete).toHaveBeenCalledWith({ idVacancy: 5 });
      expect(res).toEqual({ message: 'Vacancy with id 5 removed' });
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(6)).rejects.toThrow(NotFoundException);
    });
  });
});
