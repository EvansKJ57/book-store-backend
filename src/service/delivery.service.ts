import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDeliveryInfoDto } from 'src/dtos/delivery.dto';
import { DeliveryModel } from 'src/entities/delivery.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryModel)
    private readonly deliveryRepository: Repository<DeliveryModel>,
  ) {}

  async createDelivery(data: createDeliveryInfoDto) {
    const savedDelivery = await this.deliveryRepository.save(data);
    return savedDelivery;
  }
}
