import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { VacancyStatus } from 'src/common/enums/vacancy-status.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    try {
      // ensure vacancy exists
      const vacancy = await this.vacancyRepository.findOne({ where: { idVacancy: createApplicationDto.vacancyId } });
      if (!vacancy) throw new NotFoundException(`Vacancy with id ${createApplicationDto.vacancyId} not found`);

      // ensure vacancy is active
      if ((vacancy as any).status && (vacancy as any).status !== VacancyStatus.ACTIVE) {
        throw new BadRequestException('Cannot apply to an inactive vacancy');
      }

      // count existing applications for this vacancy
      const currentCount = await this.applicationRepository.count({ where: { vacancyId: createApplicationDto.vacancyId } });
      if (vacancy.maxApplicants !== undefined && vacancy.maxApplicants !== null && currentCount >= vacancy.maxApplicants) {
        throw new BadRequestException('Maximum number of applicants reached for this vacancy');
      }

      // ensure user exists
      const user = await this.userRepository.findOne({ where: { idUser: createApplicationDto.userId } });
      if (!user) throw new NotFoundException(`User with id ${createApplicationDto.userId} not found`);

      // ensure user does not exceed active applications limit (max 3)
      const userApplicationsCount = await this.applicationRepository.count({ where: { userId: createApplicationDto.userId } });
      if (userApplicationsCount >= 3) {
        throw new BadRequestException('User has reached the maximum of 3 active applications');
      }

      const payload: Partial<Application> = {
        userId: createApplicationDto.userId,
        vacancyId: createApplicationDto.vacancyId,
        appliedAt: createApplicationDto.appliedAt ? new Date(createApplicationDto.appliedAt) : new Date(),
      };

      const newApp = this.applicationRepository.create(payload as any);
      return await this.applicationRepository.save(newApp);
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error creating application');
    }
  }

  async getVacanciesByUserEmail(email: string) {
    if (!email) throw new BadRequestException('An email is required');

    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException(`User with email "${email}" not found`);

    const apps = await this.applicationRepository.find({ where: { userId: user.idUser }, relations: ['vacancy'] });
    return apps.map(a => a.vacancy);
  }

  async findAll() {
    try {
      return await this.applicationRepository.find();
    } catch (err) {
      throw new InternalServerErrorException('Error fetching applications');
    }
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('An id is required');
    try {
      const app = await this.applicationRepository.findOne({ where: { idApplication: id } });
      if (!app) throw new NotFoundException(`Application with id ${id} not found`);
      return app;
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error fetching application');
    }
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    try {
      const result = await this.applicationRepository.update({ idApplication: id } as any, updateApplicationDto as any);
      if (result.affected === 0) throw new NotFoundException(`Application with id ${id} not found`);
      return this.applicationRepository.findOne({ where: { idApplication: id } });
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error updating application');
    }
  }

  async remove(id: number) {
    try {
      const app = await this.applicationRepository.findOne({ where: { idApplication: id } });
      if (!app) throw new NotFoundException(`Application with id ${id} not found`);
      await this.applicationRepository.delete({ idApplication: id } as any);
      return { message: `Application with id ${id} removed` };
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error removing application');
    }
  }
}
