import { IsOptional, MinLength } from "class-validator";
import { Modality } from "src/common/enums/modality.enum";
import { BaseCatalogue } from "src/common/timestamp-base-entity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('vacancies')
export class Vacancy extends BaseCatalogue {
    @PrimaryGeneratedColumn('increment', { name: 'id_vacancy' })
    idVacancy: number;

    @Column()
    @MinLength(6)
    title: string;

    @Column()
    @IsOptional()
    description: string;

    @Column()
    technologies: string;

    @Column()
    seniority: string;

    @Column()
    softSkills: string;

    @Column()
    location: string;

    @Column({ type: 'enum', enum: Modality })
    modality: Modality;

    @Column({ type: 'decimal' })
    salaryRange: number;

    @Column()
    company: string;

    @Column()
    maxApplicants: number;
}