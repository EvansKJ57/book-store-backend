import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetailModel)
    private readonly orderDetailRepository: Repository<OrderDetailModel>,
  ) {}

  async createOrderDetail(carts: CartModel[], orderId: number) {
    const createdOrderDetails = carts.map((cart) =>
      this.orderDetailRepository.create({
        book: { id: cart.bookId },
        order: { id: orderId },
        qty: cart.qty,
      }),
    );

    return this.orderDetailRepository.save(createdOrderDetails);
  }
}
