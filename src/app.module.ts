import { Module } from '@nestjs/common';
import { UsersModule } from './moduels/users.module';
import { BooksModule } from './moduels/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './moduels/categories.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './moduels/likes.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './moduels/carts.module';
import { OrdersModule } from './moduels/orders.module';
import { OrderDetailsModule } from './moduels/order-details.module';
import { DeliveryModule } from './moduels/delivery.module';
import { typeormConfig } from './config/typrorm.postgres.confiig';
import localConfig from './config/environment/local.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [localConfig],
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeormConfig),
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
})
export class AppModule {}
