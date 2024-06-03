import { PickType } from '@nestjs/mapped-types';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CartModel } from 'src/entities/cart.entity';

export class CreateCartDto extends PickType(CartModel, ['qty'] as const) {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  qty: number;
}

export class CartsResDto extends PickType(CartModel, [
  'id',
  'qty',
  'updatedAt',
] as const) {
  @Expose()
  id: number;

  @Expose()
  qty: number;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.book.id, { toClassOnly: true })
  bookId: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id, { toClassOnly: true })
  userId: number;
}
