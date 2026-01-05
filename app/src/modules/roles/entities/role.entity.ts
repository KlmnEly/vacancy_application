import { BaseCatalogue } from "src/common/timestamp-base-entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role extends BaseCatalogue {
    @PrimaryGeneratedColumn('increment', { name: 'id_role' })
    idRole: number;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
