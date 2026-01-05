import { ApiProperty } from '@nestjs/swagger';
import { Modality } from 'src/common/enums/modality.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVacancyDto {
    @ApiProperty({
        required: true,
        description: 'Title of the vacancy',
        example: 'Frontend Developer',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty({
        required: true,
        description: 'Description of the vacancy',
        example: 'We are looking for a skilled frontend developer...',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        required: true,
        description: 'Technologies required for the vacancy',
        example: 'React, TypeScript, Node.js',
    })
    @IsNotEmpty()
    @IsString()
    technologies: string;

    @ApiProperty({
        required: true,
        description: 'Seniority level for the vacancy',
        example: 'Junior',
    })
    @IsNotEmpty()
    @IsString()
    seniority: string;

    @ApiProperty({
        required: false,
        description: 'Soft skills required for the vacancy',
        example: 'Teamwork, Communication, Problem-solving',
    })
    @IsOptional()
    @IsString()
    softSkills?: string;

    @ApiProperty({
        required: true,
        description: 'Location of the vacancy',
        example: 'Barranquilla, Colombia',
    })
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty({
        required: true,
        description: 'Modality of the vacancy',
        example: Modality.REMOTO,
        enum: Modality,
    })
    @IsEnum(Modality)
    modality: Modality;

    @ApiProperty({
        required: true,
        description: 'Salary range for the vacancy',
        example: 1500,
    })
    @IsNumber()
    salaryRange: number;

    @ApiProperty({
        required: true,
        description: 'Company offering the vacancy',
        example: 'Gases del Caribe.',
    })
    @IsNotEmpty()
    @IsString()
    company: string;

    @ApiProperty({
        required: true,
        description: 'Maximum number of applicants for the vacancy',
        example: 10,
    })
    @IsNumber()
    maxApplicants: number;
}

