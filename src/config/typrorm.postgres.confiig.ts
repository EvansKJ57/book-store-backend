import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get<string>('db.host'),
      port: configService.get<number>('db.port'),
      username: configService.get<string>('db.user'),
      password: configService.get<string>('db.pw'),
      database: configService.get<string>('db.string'),
      autoLoadEntities: true,
      synchronize: true, // 자동연동 여부, 프로덕션 환경에서는 false로 한다.
    };
  },
};
