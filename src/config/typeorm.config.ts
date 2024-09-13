import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const port = parseInt(configService.get<string>('DB_PORT'));
  const nodeEnv = configService.get<string>('NODE_ENV');
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port,
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: nodeEnv !== 'prod',
  };
};
