import { Exclude, Expose, Transform } from 'class-transformer';
import { BookModel } from 'src/entities/book.entity';

export class BookResDto extends BookModel {
  id: number;

  title: string;

  img: number;

  form: string;

  isbn: string;

  summary: string;

  detail: string;

  author: string;

  pages: number;

  indexList: string[];

  price: number;

  pubDate: Date;

  @Expose()
  @Transform(({ obj }) => obj.category.name, { toClassOnly: true })
  categoryName: string;

  @Expose()
  @Transform(
    ({ obj }) => (obj.liked.length > 0 ? obj.liked.map((user) => user.id) : []),
    {
      toClassOnly: true,
    },
  )
  likedUser: number[];
}

@Exclude()
export class BookSummaryResDto extends BookResDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  img: number;
  @Expose()
  author: string;
  @Expose()
  price: number;
}
