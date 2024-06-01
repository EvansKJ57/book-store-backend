import { Exclude, Expose, Transform } from 'class-transformer';
import { CartModel, TCartStatus } from 'src/entities/cart.entity';

export class CartsResDto extends CartModel {
  id: number;

  qty: number;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  status: TCartStatus;

  @Expose()
  @Transform(({ obj }) => obj.book.id, { toClassOnly: true })
  bookId: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id, { toClassOnly: true })
  userId: number;
}
