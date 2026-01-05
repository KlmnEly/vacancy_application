import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  //Swagger set up
  const config = new DocumentBuilder()
    .setTitle('Vacancy Application API')
    .setDescription('API documentation for the Vacancy Application')
    .setVersion('1.0')
    // register a named bearer auth scheme for Swagger (use the same name in controllers if using @ApiBearerAuth)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Apply global security requirement so Swagger UI includes the bearer token for secured endpoints
  (document as any).security = [{ 'access-token': [] }];
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      authAction: {
        // pre-configure the authorize modal entry name so users know to include the Bearer prefix
        'access-token': {
          name: 'Authorization',
          schema: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'Bearer '
        }
      }
    }
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignores properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/api/v1/docs`);
}

bootstrap();
