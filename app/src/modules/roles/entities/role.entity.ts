import { BaseCatalogue } from "src/common/timestamp-base-entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role extends BaseCatalogue {
    @PrimaryGeneratedColumn('increment', { name: 'id_role' })
    idRole: number;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

}
