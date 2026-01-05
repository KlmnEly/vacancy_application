import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';
import { Application } from '../applications/entities/application.entity';
import { VacancyStatus } from 'src/common/enums/vacancy-status.enum';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto) {
    try {
      const newVacancy = this.vacancyRepository.create(createVacancyDto as any);
      return await this.vacancyRepository.save(newVacancy);
    } catch (err) {
      throw new InternalServerErrorException('Error creating vacancy');
    }
  }

  async findAll() {
    try {
      const vacancies = await this.vacancyRepository.find();
      const results = await Promise.all(
        vacancies.map(async (v) => {
          const currentCount = await this.applicationRepository.count({ where: { vacancyId: v.idVacancy } });
          const remainingSlots = v.maxApplicants !== undefined && v.maxApplicants !== null ? Math.max(0, v.maxApplicants - currentCount) : null;
          const isActive = v.status === VacancyStatus.ACTIVE;
          const canApply = isActive && (remainingSlots === null ? true : remainingSlots > 0);
          return { ...v, remainingSlots, canApply };
        }),
      );
      return results;
    } catch (err) {
      throw new InternalServerErrorException('Error fetching vacancies');
    }
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('An id is required');

    try {
      const vacancy = await this.vacancyRepository.findOne({ where: { idVacancy: id } });
      if (!vacancy) throw new NotFoundException(`Vacancy with id ${id} not found`);
      const currentCount = await this.applicationRepository.count({ where: { vacancyId: vacancy.idVacancy } });
      const remainingSlots = vacancy.maxApplicants !== undefined && vacancy.maxApplicants !== null ? Math.max(0, vacancy.maxApplicants - currentCount) : null;
      const isActive = vacancy.status === VacancyStatus.ACTIVE;
      const canApply = isActive && (remainingSlots === null ? true : remainingSlots > 0);
      return { ...vacancy, remainingSlots, canApply };
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error fetching vacancy');
    }
  }

  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    try {
      const result = await this.vacancyRepository.update({ idVacancy: id } as any, updateVacancyDto as any);
      if (result.affected === 0) throw new NotFoundException(`Vacancy with id ${id} not found`);
      return this.vacancyRepository.findOne({ where: { idVacancy: id } });
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error updating vacancy');
    }
  }

  async remove(id: number) {
    try {
      const vacancy = await this.vacancyRepository.findOne({ where: { idVacancy: id } });
      if (!vacancy) throw new NotFoundException(`Vacancy with id ${id} not found`);
      await this.vacancyRepository.delete({ idVacancy: id } as any);
      return { message: `Vacancy with id ${id} removed` };
    } catch (err: any) {
      if (err.status) throw err;
      throw new InternalServerErrorException('Error removing vacancy');
    }
  }
}
