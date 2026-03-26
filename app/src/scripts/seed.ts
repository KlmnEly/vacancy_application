import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Role as RoleEnum } from '../common/enums/role.enum';
import { Vacancy } from '../modules/vacancies/entities/vacancy.entity';
import { Application } from '../modules/applications/entities/application.entity';
import { Modality } from '../common/enums/modality.enum';
import { VacancyStatus } from '../common/enums/vacancy-status.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';

export async function runSeed(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const vacancyRepo = dataSource.getRepository(Vacancy);
  const applicationRepo = dataSource.getRepository(Application);

  // Seed roles from enum
  const rolesToCreate = Object.values(RoleEnum);
  const createdRoles: Record<string, Role> = {};

  for (const roleName of rolesToCreate) {
    let role: Role | null = await roleRepo.findOne({
      where: { name: roleName },
    });
    if (!role) {
      const newRole = roleRepo.create({
        name: roleName,
        isActive: true,
      } as Partial<Role>);
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
    {
      email: 'gestor@gestor.com',
      fullname: 'Gestor User',
      role: RoleEnum.GESTOR,
    },
    { email: 'coder@coder.com', fullname: 'Coder User', role: RoleEnum.CODER },
    {
      email: 'coder2@coder.com',
      fullname: 'Coder Two',
      role: RoleEnum.CODER,
    },
    {
      email: 'coder3@coder.com',
      fullname: 'Coder Three',
      role: RoleEnum.CODER,
    },
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

  // Seed vacancies
  const vacanciesToCreate: Partial<Vacancy>[] = [
    {
      title: 'Frontend Developer',
      description: 'Build modern web interfaces with React and TypeScript.',
      technologies: 'React, TypeScript, Jest',
      seniority: 'Junior',
      softSkills: 'Communication, Teamwork, Ownership',
      location: 'Barranquilla, Colombia',
      modality: Modality.HIBRIDO,
      salaryRange: 2500,
      company: 'Vacancy Labs',
      maxApplicants: 10,
      status: VacancyStatus.ACTIVE,
      isActive: true,
    },
    {
      title: 'Backend Node Engineer',
      description: 'Develop and maintain REST APIs in NestJS.',
      technologies: 'Node.js, NestJS, PostgreSQL',
      seniority: 'Semi Senior',
      softSkills: 'Problem Solving, Collaboration',
      location: 'Medellin, Colombia',
      modality: Modality.REMOTO,
      salaryRange: 3200,
      company: 'Vacancy Labs',
      maxApplicants: 10,
      status: VacancyStatus.ACTIVE,
      isActive: true,
    },
    {
      title: 'QA Automation Engineer',
      description: 'Automate API and integration tests for backend services.',
      technologies: 'Playwright, Postman, TypeScript',
      seniority: 'Senior',
      softSkills: 'Attention to Detail, Leadership',
      location: 'Bogota, Colombia',
      modality: Modality.PRESENCIAL,
      salaryRange: 3500,
      company: 'Vacancy Labs',
      maxApplicants: 10,
      status: VacancyStatus.ACTIVE,
      isActive: true,
    },
  ];

  const seededVacancies: Vacancy[] = [];
  for (const vacancyData of vacanciesToCreate) {
    const existingVacancy = await vacancyRepo.findOne({
      where: { title: vacancyData.title },
    });

    if (existingVacancy) {
      seededVacancies.push(existingVacancy);
      console.log(`Vacancy exists: ${vacancyData.title}`);
      continue;
    }

    const createdVacancy = vacancyRepo.create(vacancyData as Vacancy);
    const savedVacancy = await vacancyRepo.save(createdVacancy);
    seededVacancies.push(savedVacancy);
    console.log(`Created vacancy: ${savedVacancy.title}`);
  }

  // Seed applications with status fixtures for UI testing
  const coderRoleId = createdRoles[RoleEnum.CODER]?.idRole;
  const coderUsers = coderRoleId
    ? await userRepo.find({ where: { roleId: coderRoleId } })
    : [];

  if (coderUsers.length === 0) {
    console.log('No coder users found. Skipping applications seed.');
    console.log('Seeding finished.');
    return;
  }

  const targetVacancies = seededVacancies.slice(0, 3);
  if (targetVacancies.length === 0) {
    console.log('No vacancies found. Skipping applications seed.');
    console.log('Seeding finished.');
    return;
  }

  const statuses: ApplicationStatus[] = [
    ApplicationStatus.PENDING,
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.REJECTED,
  ];

  for (let userIndex = 0; userIndex < coderUsers.length; userIndex++) {
    const coderUser = coderUsers[userIndex];

    for (let vacancyIndex = 0; vacancyIndex < targetVacancies.length; vacancyIndex++) {
      const vacancy = targetVacancies[vacancyIndex];
      const status =
        statuses[(userIndex + vacancyIndex) % statuses.length] ??
        ApplicationStatus.PENDING;
      const appliedAtDate = new Date(
        Date.now() - (userIndex * targetVacancies.length + vacancyIndex) * 86400000,
      );

      const existingApplication = await applicationRepo.findOne({
        where: {
          userId: coderUser.idUser,
          vacancyId: vacancy.idVacancy,
        },
      });

      if (existingApplication) {
        existingApplication.status = status;
        existingApplication.appliedAt = existingApplication.appliedAt ?? appliedAtDate;
        await applicationRepo.save(existingApplication);
        console.log(
          `Updated application (user ${coderUser.idUser}, vacancy ${vacancy.idVacancy}) -> ${status}`,
        );
        continue;
      }

      const application = applicationRepo.create({
        userId: coderUser.idUser,
        vacancyId: vacancy.idVacancy,
        status,
        isActive: true,
        appliedAt: appliedAtDate,
      } as Partial<Application>);

      await applicationRepo.save(application);
      console.log(
        `Created application (user ${coderUser.idUser}, vacancy ${vacancy.idVacancy}) -> ${status}`,
      );
    }
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
