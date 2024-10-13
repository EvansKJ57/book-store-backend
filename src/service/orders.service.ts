import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { postOrderDto } from 'src/dtos/order.dto';
import { OrderModel } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetailsService } from './order-details.service';
import { CartsService } from './carts.service';
import { DeliveryService } from './delivery.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
    private readonly orderDetailService: OrderDetailsService,
    private readonly cartService: CartsService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async findOrderOneById(orderId: number): Promise<OrderModel> {
    const foundOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        delivery: true,
        order_details: true,
      },
    });
    if (!foundOrder) {
      throw new InternalServerErrorException('해당 오더 존재하지 않음');
    }
    return foundOrder;
  }

  @Transactional()
  async createOrderTransaction(
    body: postOrderDto,
    userId: number,
  ): Promise<{ createdOrderId: number }> {
    const foundCarts = await this.cartService.findActiveByCartId(
      userId,
      body.carts,
    );

    const [savedDelivery, _] = await Promise.all([
      this.deliveryService.createDelivery(body.delivery),
      this.cartService.updateCartsStatus(foundCarts, 'purchased'),
    ]);

    const createdOrder = this.orderRepository.create({
      delivery: savedDelivery,
      user: { id: userId },
    });

    const savedOrder = await this.orderRepository.insert(createdOrder);

    await this.orderDetailService.createOrderDetail(
      foundCarts,
      savedOrder.raw[0].id,
    );

    return { createdOrderId: savedOrder.raw[0].id };
  }

  getOrders(userId: number): Promise<OrderModel[]> {
    return this.orderRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        delivery: true,
        order_details: true,
      },
    });
  }
}
