import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class BasePaginationOptDto {
  @ApiProperty({
    name: 'take',
    example: 10,
    description: '불러올 책 데이터의 갯수',
  })
  @IsInt()
  @IsOptional()
  take: number = 10;

  @ApiPropertyOptional({
    name: 'skip',
    example: 5,
    description: '몇개의 데이터를 넘기고 가져올지 정하는 매개변수',
  })
  @Expose()
  @IsInt()
  @IsOptional()
  skip?: number;
}

export class BookPaginationOptDto extends BasePaginationOptDto {
  @ApiPropertyOptional({
    name: 'newBooks',
    example: true,
    description: '신간 정보만 가져올지 ',
  })
  @Expose()
  @IsBoolean()
  @IsOptional()
  newBooks?: boolean;
}
