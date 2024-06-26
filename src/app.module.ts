import { Module } from '@nestjs/common';
import { UsersModule } from './moduels/users.module';
import { BooksModule } from './moduels/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './moduels/categories.module';
import { AuthModule } from './auth/auth.module';
import { BookModel } from './entities/book.entity';
import { UserModel } from './entities/user.entity';
import { CategoryModel } from './entities/category.entity';
import { LikesModule } from './moduels/likes.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { CartModel } from './entities/cart.entity';
import { CartsModule } from './moduels/carts.module';
import { LikeModel } from './entities/like.entity';
import { OrdersModule } from './moduels/orders.module';
import { OrderModel } from './entities/order.entity';
import { OrderDetailModel } from './entities/orderDetail.entity';
import { DeliveryModel } from './entities/Delivery.entity';
import { OrderDetailsModule } from './moduels/order-details.module';
import { DeliveryModule } from './moduels/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env.development.local',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        BookModel,
        UserModel,
        CategoryModel,
        CartModel,
        LikeModel,
        OrderModel,
        OrderDetailModel,
        DeliveryModel,
      ],
      synchronize: true, // 자동연동 여부, 프로덕션 환경에서는 false로 한다.
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
})
export class AppModule {}
