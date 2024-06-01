import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockBooksData } from '../entities/mock-data/mockBook';
import { BookModel } from 'src/entities/book.entity';
import { CategoryModel } from 'src/entities/category.entity';
import { BookResDto, BookSummaryResDto } from 'src/dtos/res/book.res.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookModel)
    private readonly bookRepository: Repository<BookModel>,
    @InjectRepository(CategoryModel)
    private readonly categoryRepository: Repository<CategoryModel>,
  ) {}
  /**
   *더미 데이터 넣기
   */
  async generateTestBooks() {
    for (let i = 0; i < mockBooksData.length; i++) {
      const { categoryId, ...rest } = mockBooksData[i];
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) {
        throw new BadRequestException('해당 카테고리 없음');
      }

      const data = { ...rest, category };
      const bookData = this.bookRepository.create(data);
      return await this.bookRepository.save(bookData);
    }
  }

  async getBooks() {
    const books = await this.bookRepository.find();
    if (!books) {
      throw new NotFoundException('도서 없음');
    }

    const booksDto = books.map((book) =>
      plainToInstance(BookSummaryResDto, book),
    );

    return booksDto;
  }

  async getBookDetail(bookId: number) {
    const foundBook = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    if (!foundBook) {
      throw new NotFoundException('해당 도서 없음');
    }

    const bookDetail = plainToInstance(BookResDto, foundBook);
    return bookDetail;
  }
}
