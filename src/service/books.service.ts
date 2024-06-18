import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { mockBooksData } from '../entities/mock-data/mockBook';
import { BookModel } from 'src/entities/book.entity';
import { CategoryModel } from 'src/entities/category.entity';
import { BookPaginationOptDto } from 'src/dtos/pagination-req.dto';
import { dateCalculate } from 'src/util/date-calculate';

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
      await this.bookRepository.save(bookData);
    }
  }

  async getBooks(dto: BookPaginationOptDto) {
    const { newBooks, ...rest } = dto;
    const whereQuery: FindOptionsWhere<BookModel> = {};
    if (newBooks) {
      whereQuery['pubDate'] = Between(dateCalculate(3), dateCalculate());
    }
    const books = await this.bookRepository.find({
      relations: {
        likes: true,
        category: true,
      },
      where: { ...whereQuery },
      ...rest,
      order: {
        id: 'ASC',
      },
    });
    if (books.length === 0) {
      throw new NotFoundException('도서 없음');
    }
    return books;
  }

  async getBookDetail(bookId: number) {
    const foundBook = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: {
        likes: true,
        category: true,
      },
    });
    if (!foundBook) {
      throw new NotFoundException('해당 도서 없음');
    }

    return foundBook;
  }
}
