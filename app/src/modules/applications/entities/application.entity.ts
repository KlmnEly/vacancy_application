import { BaseCatalogue } from 'src/common/timestamp-base-entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Vacancy } from 'src/modules/vacancies/entities/vacancy.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('applications')
export class Application extends BaseCatalogue {
	@PrimaryGeneratedColumn('increment', { name: 'id_application' })
	idApplication: number;

	@Column({ name: 'user_id' })
	userId: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ name: 'vacancy_id' })
	vacancyId: number;

	@ManyToOne(() => Vacancy)
	@JoinColumn({ name: 'vacancy_id' })
	vacancy: Vacancy;

	@Column({ name: 'applied_at', type: 'timestamp' })
	appliedAt: Date;
}
