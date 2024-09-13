import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { createDeliveryInfoDto } from './delivery.dto';
import { OrderModel } from 'src/entities/order.entity';

export class postOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  carts: number[];

  @Expose()
  @IsNotEmpty()
  delivery: createDeliveryInfoDto;
}

export class OrderDetailResDto {
  readonly bookId: number;
  readonly qty: number;
  readonly orderDetailId: number;

  constructor(data: any) {
    this.orderDetailId = data.id;
    this.bookId = data.bookId;
    this.qty = data.qty;
  }
}

export class OrderResDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly address: string;
  readonly receiver: string;
  readonly contact: string;
  readonly orderDetails: OrderDetailResDto[];

  constructor(data: OrderModel) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.address = data.delivery.address;
    this.contact = data.delivery.contact;
    this.receiver = data.delivery.receiver;
    this.orderDetails = data.orderDetails.map(
      (orderDetail) => new OrderDetailResDto(orderDetail),
    );
  }
}
