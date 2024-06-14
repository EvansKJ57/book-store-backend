import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class createDeliveryInfoDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  receiver: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('KR')
  contact: string;
}
