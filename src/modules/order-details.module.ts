import { Module } from '@nestjs/common';
import { OrderDetailsService } from '../service/order-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetailModel])],
  exports: [OrderDetailsService],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
