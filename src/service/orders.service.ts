import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { postOrderDto } from 'src/dtos/order.dto';
import { DeliveryModel } from 'src/entities/Delivery.entity';
import { CartModel } from 'src/entities/cart.entity';
import { OrderModel } from 'src/entities/order.entity';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
    @InjectRepository(OrderDetailModel)
    private readonly orderDetailRepository: Repository<OrderDetailModel>,
    @InjectRepository(DeliveryModel)
    private readonly deliveryRepository: Repository<DeliveryModel>,
    @InjectRepository(CartModel)
    private readonly cartRepository: Repository<CartModel>,

    private readonly dataSource: DataSource,
  ) {}

  async postOrder(body: postOrderDto, userId: number) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    await qr.startTransaction();

    try {
      const carts = await this.cartRepository.find({
        where: {
          user: { id: userId },
          id: In(body.carts),
          status: 'active',
        },
      });

      if (!carts.length) {
        throw new BadRequestException('해당 물품은 카트에 없습니다.');
      }

      const updatedCarts: DeepPartial<CartModel>[] = carts.map((cart) => ({
        ...cart,
        status: 'purchased',
      }));

      await qr.manager.save(CartModel, updatedCarts);

      const savedDelivery = await qr.manager.save(DeliveryModel, body.delivery);

      const createdOrder = this.orderRepository.create({
        delivery: savedDelivery,
        user: { id: userId },
      });
      const savedOrder = await qr.manager.save(OrderModel, createdOrder);

      console.log(savedOrder);
      const createdOrderDetails = carts.map((cart) =>
        this.orderDetailRepository.create({
          book: { id: cart.bookId },
          order: { id: savedOrder.id },
          qty: cart.qty,
        }),
      );

      await qr.manager.save(OrderDetailModel, createdOrderDetails);

      await qr.commitTransaction();

      const newOrder = await this.orderRepository.findOne({
        where: {
          id: savedOrder.id,
        },
        relations: {
          delivery: true,
          orderDetails: true,
        },
      });
      if (!newOrder) {
        throw new InternalServerErrorException('Order 저장 실패');
      }

      return newOrder;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
