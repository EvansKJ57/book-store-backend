import { PickType } from '@nestjs/mapped-types';
import { Expose, Transform } from 'class-transformer';

export class BookResDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  img: number;

  @Expose()
  form: string;

  @Expose()
  isbn: string;

  @Expose()
  summary: string;

  @Expose()
  detail: string;

  @Expose()
  author: string;

  @Expose()
  pages: number;

  @Expose()
  indexList: string[];

  @Expose()
  price: number;

  @Expose()
  pubDate: Date;

  @Expose()
  @Transform(({ obj }) => obj.category.name)
  categoryName: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.liked.length ? obj.liked.map((user) => user.id) : [],
  )
  likedUser: number[];
}

export class BookSummaryResDto extends PickType(BookResDto, [
  'id',
  'title',
  'img',
  'author',
  'price',
  'categoryName',
  'likedUser',
] as const) {}
