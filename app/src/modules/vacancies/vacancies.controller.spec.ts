import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

describe('VacanciesController', () => {
  let controller: VacanciesController;
  let service: VacanciesService;

  const mockVacanciesService = {
    create: jest.fn(dto => ({ idVacancy: 1, ...dto })),
    findAll: jest.fn(() => []),
    findOne: jest.fn(id => ({ idVacancy: id })),
    update: jest.fn((id, dto) => ({ idVacancy: id, ...dto })),
    remove: jest.fn(id => ({ message: `Vacancy with id ${id} removed` })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
    service = module.get<VacanciesService>(VacanciesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return created vacancy', async () => {
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

      const res = await controller.create(dto);
      expect(res).toEqual({ idVacancy: 1, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should return a vacancy by id', async () => {
      const res = await controller.findOne('10');
      expect(res).toEqual({ idVacancy: 10 });
      expect(service.findOne).toHaveBeenCalledWith(10);
    });
  });
});
