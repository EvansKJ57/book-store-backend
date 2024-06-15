import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDeliveryInfoDto } from 'src/dtos/delivery.dto';
import { DeliveryModel } from 'src/entities/Delivery.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryModel)
    private readonly deliveryRepository: Repository<DeliveryModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<DeliveryModel>(DeliveryModel)
      : this.deliveryRepository;
  }

  async createDelivery(data: createDeliveryInfoDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    const savedDelivery = await repository.save(data);
    return savedDelivery;
  }
}
