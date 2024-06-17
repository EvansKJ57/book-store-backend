import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { postOrderDto } from 'src/dtos/order.dto';
import { OrderModel } from 'src/entities/order.entity';
import { QueryRunner, Repository } from 'typeorm';
import { OrderDetailsService } from './order-details.service';
import { CartsService } from './carts.service';
import { DeliveryService } from './delivery.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
    private readonly orderDetailService: OrderDetailsService,
    private readonly cartService: CartsService,
    private readonly deliveryService: DeliveryService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<OrderModel>(OrderModel)
      : this.orderRepository;
  }

  async findOrderOneById(orderId: number) {
    const foundOrder = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        delivery: true,
        orderDetails: true,
      },
    });
    if (!foundOrder) {
      throw new InternalServerErrorException('해당 오더 존재하지 않음');
    }
    return foundOrder;
  }

  async createOrderTransaction(
    body: postOrderDto,
    userId: number,
    qr: QueryRunner,
  ) {
    const foundCarts = await this.cartService.findActiveByCartId(
      userId,
      body.carts,
    );

    const [savedDelivery, _] = await Promise.all([
      this.deliveryService.createDelivery(body.delivery, qr),
      this.cartService.updateCartsStatus(foundCarts, 'purchased'),
    ]);

    const repository = this.getRepository(qr);

    const createdOrder = repository.create({
      delivery: savedDelivery,
      user: { id: userId },
    });

    const savedOrder = await repository.save(createdOrder);

    await this.orderDetailService.createOrderDetail(
      foundCarts,
      createdOrder.id,
      qr,
    );

    return { orderId: savedOrder.id };
  }
  getOrders(userId: number) {
    return this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        delivery: true,
        orderDetails: true,
      },
    });
  }
}
