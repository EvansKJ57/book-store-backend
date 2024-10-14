import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { BooksModule } from './modules/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './modules/likes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartsModule } from './modules/carts.module';
import { OrdersModule } from './modules/orders.module';
import { OrderDetailsModule } from './modules/order-details.module';
import { DeliveryModule } from './modules/delivery.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/Logging.interceptor';
import { typeormConfig } from './config/typeorm.config';
import { envJoiSchema } from './config/env-joi-schema';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { S3Module } from './modules/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envJoiSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeormConfig,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UsersModule,
    BooksModule,
    CategoriesModule,
    AuthModule,
    LikesModule,
    CartsModule,
    OrdersModule,
    OrderDetailsModule,
    DeliveryModule,
    S3Module,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
