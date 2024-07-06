import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CartModel } from 'src/entities/cart.entity';

export class CreateCartDto extends PickType(CartModel, ['qty'] as const) {
  @ApiProperty({ example: 1, description: '카트에 담을 도서의 id' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
  @ApiProperty({ example: 1, description: '카트에 담을 도서의 권 수' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  qty: number;
}

export class CartsResDto {
  @ApiProperty({ example: 1, description: '카트 id' })
  readonly id: number;
  @ApiProperty({ example: 2, description: '카트에 담긴 도서의 권 수' })
  readonly qty: number;
  @ApiProperty({
    example: '2024-06-27T06:35:41.622Z',
    description: '카트 업데이트 날짜',
  })
  readonly updatedAt: Date;
  @ApiProperty({ example: 1, description: '카트에 담긴 도서의 id' })
  readonly bookId: number;
  @ApiProperty({ example: 4, description: '카트를 소유한 유저 id' })
  readonly userId: number;

  constructor(data: CartModel) {
    this.id = data.id;
    this.qty = data.qty;
    this.updatedAt = data.updatedAt;
    this.bookId = data.bookId;
    this.userId = data.userId;
  }
}
