import { Module } from '@nestjs/common';
import { UsersModule } from './moduels/users.module';
import { BooksModule } from './moduels/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './moduels/categories.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './moduels/likes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartsModule } from './moduels/carts.module';
import { OrdersModule } from './moduels/orders.module';
import { OrderDetailsModule } from './moduels/order-details.module';
import { DeliveryModule } from './moduels/delivery.module';
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
