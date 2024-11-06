import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookPaginationOptDto } from 'src/dtos/pagination-req.dto';
import { BookModel } from 'src/entities/book.entity';
import { CartModel } from 'src/entities/cart.entity';
import { CategoryModel } from 'src/entities/category.entity';
import { DeliveryModel } from 'src/entities/delivery.entity';
import { LikeModel } from 'src/entities/like.entity';
import { OrderModel } from 'src/entities/order.entity';
import { OrderDetailModel } from 'src/entities/orderDetail.entity';
import { UserModel } from 'src/entities/user.entity';
import { BooksService } from 'src/service/books.service';
import { DataSource } from 'typeorm';

describe('bookService', () => {
  let bookService: BooksService;
  let dataSource: DataSource;

  let books: BookModel[];
  let categories: CategoryModel[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [
            BookModel,
            CartModel,
            CategoryModel,
            LikeModel,
            UserModel,
            OrderModel,
            OrderDetailModel,
            DeliveryModel,
          ],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([BookModel]),
      ],
      providers: [BooksService],
    }).compile();

    bookService = module.get<BooksService>(BooksService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    const bookRepository = dataSource.getRepository(BookModel);
    const categoryRepository = dataSource.getRepository(CategoryModel);

    categories = [1, 2, 3].map((c) =>
      categoryRepository.create({
        id: c,
        name: `test-category${c}`,
      }),
    );

    await categoryRepository.save(categories);

    books = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22,
    ].map((b) =>
      bookRepository.create({
        id: b,
        author: `tester${b}`,
        category: categories[Math.floor(Math.random() * 3)],
        form: 'test-form',
        img: 1,
        indexList: [],
        isbn: `isbn-${b * 10}`,
        title: `test-book-${b}`,
        pages: b * 100,
        price: b * 1000,
        summary: `summary-${b}`,
        detail: `detail-${b}`,
        pubDate: new Date(`2020-01-${b}`),
      }),
    );
    await bookRepository.save(books);
  });

  describe('getBooks', () => {
    it.each([
      [0, 10],
      [0, 5],
      [5, 5],
      [10, 5],
      [7, 3],
    ])(
      `should return books when skip is %d and take is %d`,
      async (skip, take) => {
        const dto: BookPaginationOptDto = { take, skip };

        const result = await bookService.getBooks(dto);

        const skipCount = dto.skip || 0;

        expect(result).toHaveLength(Math.min(books.length - skipCount, take));
        expect(result.map((x) => x.id)).toEqual(
          books.slice(skipCount, skipCount + dto.take).map((x) => x.id),
        );
        result.forEach((book) => {
          expect(book).toHaveProperty('id');
          expect(book).toHaveProperty('author');
          expect(book).toHaveProperty('category');
          expect(book).toHaveProperty('form');
          expect(book).toHaveProperty('img');
          expect(book).toHaveProperty('indexList');
          expect(book).toHaveProperty('isbn');
          expect(book).toHaveProperty('title');
          expect(book).toHaveProperty('pages');
          expect(book).toHaveProperty('price');
          expect(book).toHaveProperty('summary');
          expect(book).toHaveProperty('detail');
          expect(book).toHaveProperty('pubDate');
        });
      },
    );
    it('should throw a NotFoundException when skip exceeds the total number of books', async () => {
      const dto: BookPaginationOptDto = { take: 5, skip: 30 };

      await expect(bookService.getBooks(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
