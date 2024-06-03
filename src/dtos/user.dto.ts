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

export class FoundUserResDto extends PickType(UserModel, [
  'id',
  'email',
  'nickname',
]) {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;
}
