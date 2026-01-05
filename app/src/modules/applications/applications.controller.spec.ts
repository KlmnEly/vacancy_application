import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  const mockService = {
    create: jest.fn(dto => ({ idApplication: 1, ...dto })),
    findAll: jest.fn(() => []),
    findOne: jest.fn(id => ({ idApplication: id })),
    getVacanciesByUserEmail: jest.fn(email => [{ idVacancy: 1 }]),
    update: jest.fn((id, dto) => ({ idApplication: id, ...dto })),
    remove: jest.fn(id => ({ message: `Application with id ${id} removed` })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    const dto: CreateApplicationDto = { userId: 1, vacancyId: 2 } as any;
    const res = await controller.create(dto);
    expect(res).toEqual({ idApplication: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findOne should call service.findOne', async () => {
    const res = await controller.findOne('3');
    expect(res).toEqual({ idApplication: 3 });
    expect(service.findOne).toHaveBeenCalledWith(3);
  });

  it('getVacanciesByUserEmail should return vacancies', async () => {
    const res = await controller.getVacanciesByUserEmail('a@a.com');
    expect(res).toEqual([{ idVacancy: 1 }]);
    expect(service.getVacanciesByUserEmail).toHaveBeenCalledWith('a@a.com');
  });
});
