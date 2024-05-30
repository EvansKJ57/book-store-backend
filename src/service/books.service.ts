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
    const data = await this.bookRepository.find();
    if (!data) {
      throw new NotFoundException('도서 없음');
    }
    const books = data.map((book) => {
      const { category, ...rest } = book;
      return { ...rest, category: category.categoryName };
    });
    return books;
  }

  async getBookDetail(id: number) {
    const findBooks = await this.bookRepository.findOneBy({ id });
    if (!findBooks) {
      throw new NotFoundException('해당 도서 없음');
    }
    const { category, ...rest } = findBooks;
    return { ...rest, category: category.categoryName };
  }
}
