import { Module } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrdersController } from '../controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModel } from 'src/entities/order.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from './users.module';
import { OrderDetailsModule } from './order-details.module';
import { CartsModule } from './carts.module';
import { DeliveryModule } from './delivery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderModel]),
    AuthModule,
    UsersModule,
    OrderDetailsModule,
    CartsModule,
    DeliveryModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
