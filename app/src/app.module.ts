import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { join } from 'path';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VacanciesModule } from './modules/vacancies/vacancies.module';

const runningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
const externalEnvPath = join(__dirname, '../../', '.env');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
      ignoreEnvFile: runningInDocker,
      envFilePath: runningInDocker ? undefined : externalEnvPath,
    }),
    DatabaseModule,
    RolesModule,
    UsersModule,
    AuthModule,
    VacanciesModule,
  ],
controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
