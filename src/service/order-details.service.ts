import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetailModel)
    private readonly orderDetailRepository: Repository<OrderDetailModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<OrderDetailModel>(OrderDetailModel)
      : this.orderDetailRepository;
  }

  async createOrderDetail(
    carts: CartModel[],
    orderId: number,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);
    const createdOrderDetails = carts.map((cart) =>
      repository.create({
        book: { id: cart.bookId },
        order: { id: orderId },
        qty: cart.qty,
      }),
    );

    return repository.save(createdOrderDetails);
  }
}
