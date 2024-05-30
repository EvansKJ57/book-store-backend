import { Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from '../service/books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * 테스트용
   */
  @Post()
  async generateTestData() {
    return this.booksService.generateTestBooks();
  }

  //(카테고리 별, 신간) 전체 도서 목록 조회
  @Get()
  async getAllBooks() {
    return this.booksService.getBooks();
  }
  @Get(':id')
  async getBookDetail(@Param('id') bookId: string) {
    return this.booksService.getBookDetail(+bookId);
  }
}
