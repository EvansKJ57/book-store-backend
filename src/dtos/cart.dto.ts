import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CartModel } from 'src/entities/cart.entity';

export class CreateCartDto extends PickType(CartModel, ['qty'] as const) {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  qty: number;
}

export class CartsResDto {
  readonly id: number;
  readonly qty: number;
  readonly updatedAt: Date;
  readonly bookId: number;
  readonly userId: number;

  constructor(data: CartModel) {
    this.id = data.id;
    this.qty = data.qty;
    this.updatedAt = data.updatedAt;
    this.bookId = data.bookId;
    this.userId = data.userId;
  }
}
