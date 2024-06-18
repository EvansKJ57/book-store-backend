import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from '../service/books.service';
import { BookDetailDto, BookDto } from 'src/dtos/book.dto';
import { BookPaginationOptDto } from 'src/dtos/pagination-req.dto';

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
  async getAllBooks(@Query() query: BookPaginationOptDto) {
    const bookResults = await this.booksService.getBooks(query);

    return bookResults.map((book) => new BookDto(book));
  }
  @Get(':id')
  async getBookDetail(@Param('id', ParseIntPipe) bookId: number) {
    const bookResult = await this.booksService.getBookDetail(bookId);
    return new BookDetailDto(bookResult);
  }
}
