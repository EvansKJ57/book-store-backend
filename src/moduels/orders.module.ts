import { Module } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrdersController } from '../controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModel } from 'src/entities/order.entity';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';
import { DeliveryModel } from 'src/entities/Delivery.entity';
import { CartModel } from 'src/entities/cart.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderModel,
      OrderDetailModel,
      DeliveryModel,
      CartModel,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
