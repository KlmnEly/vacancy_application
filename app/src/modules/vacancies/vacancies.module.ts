import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { Vacancy } from './entities/vacancy.entity';
import { Application } from '../applications/entities/application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, Application])],
  controllers: [VacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}
