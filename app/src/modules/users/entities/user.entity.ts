import { BaseCatalogue } from "src/common/timestamp-base-entity";
import { Role } from "src/modules/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User  extends BaseCatalogue {
    @PrimaryGeneratedColumn('increment', { name: 'id_user' })
    idUser: number;

    @Column({ name: 'role_id', default: 1 })
    roleId: number;

    @Column()
    fullname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
