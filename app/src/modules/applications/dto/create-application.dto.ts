import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateApplicationDto {
	@ApiProperty({ required: true, description: 'User id applying', example: 1 })
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@ApiProperty({ required: true, description: 'Vacancy id', example: 1 })
	@IsNotEmpty()
	@IsNumber()
	vacancyId: number;

	@ApiProperty({ required: false, description: 'Applied at timestamp', example: '2026-01-01T12:00:00Z' })
	@IsOptional()
	@IsDateString()
	appliedAt?: string;
}
