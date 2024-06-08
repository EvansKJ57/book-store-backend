import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UserModel } from 'src/entities/user.entity';

export class CreateUserDto extends PickType(UserModel, [
  'email',
  'nickname',
  'password',
] as const) {
  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  nickname: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  password: string;
}

export class UserResDto {
  readonly id: number;
  readonly email: string;
  readonly nickname: string;
  constructor(data: UserModel) {
    this.id = data.id;
    this.email = data.email;
    this.nickname = data.nickname;
  }
}

export class UserDetailResDto extends UserResDto {
  readonly cartsId: number[];
  readonly likedBooksId: number[];

  constructor(data: UserModel) {
    super(data);
    this.cartsId = data.carts.map((cart) => cart.id);
    this.likedBooksId = data.liked.map((book) => book.bookId);
  }
}
