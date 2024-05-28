import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { UsersModel } from 'src/entities/users.entity';

export class CreateUserDto extends PickType(UsersModel, [
  'email',
  'nickname',
  'password',
]) {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  nickname: string;

  @IsNotEmpty()
  @Length(4, 12)
  password: string;
}
