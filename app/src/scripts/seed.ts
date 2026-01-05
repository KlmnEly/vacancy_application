import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Role as RoleEnum } from '../common/enums/role.enum';

export async function runSeed(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  // Seed roles from enum
  const rolesToCreate = Object.values(RoleEnum);
  const createdRoles: Record<string, Role> = {};

  for (const roleName of rolesToCreate) {
    let role: Role | null = await roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      const newRole = roleRepo.create({ name: roleName, isActive: true } as Partial<Role>);
      role = await roleRepo.save(newRole as any);
      console.log(`Created role: ${roleName}`);
    } else {
      console.log(`Role exists: ${roleName}`);
    }
    // role is guaranteed to be non-null here
    createdRoles[roleName] = role as Role;
  }

  // Seed users
  const usersToCreate = [
    { email: 'admin@admin.com', fullname: 'Admin User', role: RoleEnum.ADMIN },
    { email: 'gestor@gestor.com', fullname: 'Gestor User', role: RoleEnum.GESTOR },
  ];

  for (const u of usersToCreate) {
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (existing) {
      console.log(`User exists: ${u.email}`);
      continue;
    }

    const hashed = await bcrypt.hash('123456', 10);
    const roleEntity = createdRoles[u.role];

    const newUser = userRepo.create({
      fullname: u.fullname,
      email: u.email,
      password: hashed,
      role: roleEntity,
      roleId: roleEntity.idRole,
      isActive: true,
    } as any);

    await userRepo.save(newUser);
    console.log(`Created user: ${u.email} with role ${u.role}`);
  }

  console.log('Seeding finished.');
}

// If invoked directly, create an application context and run seed.
if (require.main === module) {
  (async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
      const dataSource = app.get(DataSource);
      await runSeed(dataSource);
    } catch (err) {
      console.error('Seeding error:', err);
    } finally {
      await app.close();
      process.exit(0);
    }
  })();
}
