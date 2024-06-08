import { BookModel } from 'src/entities/book.entity';

export class BookDto {
  readonly id: number;
  readonly title: string;
  readonly img: number;
  readonly author: string;
  readonly price: number;
  readonly pubDate: Date;
  readonly categoryName: string;
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
  readonly isbn: string;
  readonly summary: string;
  readonly detail: string;
  readonly pages: number;
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
