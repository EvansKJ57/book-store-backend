import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TProvider, UserModel } from 'src/entities/user.entity';

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

  @Expose()
  @IsOptional()
  provider?: TProvider = 'LOCAL';

  @Expose()
  @IsOptional()
  @IsString()
  provider_sub?: string | null;
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
