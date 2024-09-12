import { Module } from '@nestjs/common';
import { DeliveryService } from '../service/delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryModel } from 'src/entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryModel])],
  exports: [DeliveryService],
  providers: [DeliveryService],
})
export class DeliveryModule {}
