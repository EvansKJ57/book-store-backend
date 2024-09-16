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
import { TransactionInterceptor } from './interceptor/transaction.interceptor';
import { LoggingInterceptor } from './interceptor/Logging.interceptor';
import { typeormConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeormConfig,
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
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
  ],
})
export class AppModule {}
