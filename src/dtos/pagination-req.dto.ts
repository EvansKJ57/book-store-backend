import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationOptDto {
  @IsInt()
  @IsOptional()
  take: number = 10;

  @Expose()
  @IsNumber()
  @IsOptional()
  skip?: number;
}

export class BookPaginationOptDto extends BasePaginationOptDto {
  @Expose()
  @IsBoolean()
  @IsOptional()
  newBooks?: boolean;
}
