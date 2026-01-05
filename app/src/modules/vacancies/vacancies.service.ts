import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
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
      return await this.vacancyRepository.find();
    } catch (err) {
      throw new InternalServerErrorException('Error fetching vacancies');
    }
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('An id is required');

    try {
      const vacancy = await this.vacancyRepository.findOne({ where: { idVacancy: id } });
      if (!vacancy) throw new NotFoundException(`Vacancy with id ${id} not found`);
      return vacancy;
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
