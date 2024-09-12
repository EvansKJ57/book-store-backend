import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  const frontUrl = configService.get<string>('FRONT_BASE_URL');
  const port = configService.get<number>('PORT');
  const swaggerPw = configService.get<string>('SWAGGER_PW');

  app.enableCors({
    origin: `${frontUrl}`,
    credentials: true,
  });
  app.use(cookieParser());

  if (nodeEnv === 'prod') {
    app.use(
      ['/api'],
      expressBasicAuth({
        challenge: true,
        users: {
          admin: swaggerPw,
        },
      }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
}
bootstrap();
