import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { BookModel } from 'src/entities/book.entity';

export class BookDto {
  @ApiProperty({ example: 1, description: 'book id' })
  readonly id: number;
  @ApiProperty({ example: 'harry potter', description: 'book title' })
  readonly title: string;
  @ApiProperty({ example: 1, description: 'book img name' })
  readonly img: number;
  @ApiProperty({ example: 'john', description: 'books author' })
  readonly author: string;
  @ApiProperty({ example: 12.12, description: 'book price' })
  readonly price: number;
  @ApiProperty({ example: '2024-01-23', description: '도서 출간일' })
  readonly pubDate: Date;
  @ApiProperty({ example: '에세이', description: '해당 책의 카테고리' })
  readonly categoryName: string;
  @ApiProperty({
    example: [1, 2, 3],
    description: '이 책을 좋아하는 유저들의 아이디',
  })
  readonly likedBy: number[];

  constructor(data: BookModel) {
    this.id = data.id;
    this.title = data.title;
    this.img = data.img;
    this.author = data.author;
    this.price = data.price;
    this.pubDate = data.pubDate;
    this.categoryName = data.category.name;
    this.likedBy = data.likes.map((like) => like.userId);
  }
}

export class BookDetailDto extends BookDto {
  @ApiProperty({
    example: '978-3-5-293-65505-0',
    description: 'isbn 식별 번호',
  })
  readonly isbn: string;
  @ApiProperty({
    example: 'We pick property give idea heavy. Test measure many to.',
    description: '책 내용 요약',
  })
  readonly summary: string;
  @ApiProperty({
    example:
      'Now lawyer serious guy dream company recognize. About nothing approach safe contain then.Huge a man position necessary.',
    // description: '책 내용 세부 설명',
  })
  readonly detail: string;
  @ApiProperty({ example: 432, description: '책의 총 페이지 수' })
  readonly pages: number;
  @ApiProperty({
    example: [
      'Several build bill black able.',
      'Industry whether shake.',
      'Hundred song sit rest seek around.',
      'Study run effort environmental quickly.',
      'Everything up nature.',
    ],
    description: '책의 목차 리스트',
  })
  readonly indexList: string[];

  constructor(data: BookModel) {
    super(data);
    this.isbn = data.isbn;
    this.summary = data.summary;
    this.detail = data.detail;
    this.pages = data.pages;
    this.indexList = data.indexList;
  }
}
