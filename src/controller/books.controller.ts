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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * 테스트용
   */
  @ApiOperation({
    summary: '테스트 데이터 넣기',
    description: '테스트용 데이터',
  })
  @Post()
  async generateTestData() {
    return this.booksService.generateTestBooks();
  }

  //(카테고리 별, 신간) 전체 도서 목록 조회
  @ApiOperation({
    summary: '모든 책을 가져온다.',
    description: '쿼리 조건에 따라사 다양한 책을 가져온다.',
  })
  @ApiResponse({ type: BookDto, status: 200, description: 'Success' })
  @Get()
  async getAllBooks(@Query() query: BookPaginationOptDto) {
    const bookResults = await this.booksService.getBooks(query);

    return bookResults.map((book) => new BookDto(book));
  }
  @Get(':id')
  @ApiOperation({
    summary: '해당 아이디 도서 데이터 가져온다.',
    description: '해당 아이디 도서 데이터 가져온다.',
  })
  @ApiParam({ name: 'id', description: '가져올 책의 아이디' })
  @ApiResponse({ type: BookDetailDto, status: 200 })
  async getBookDetail(@Param('id', ParseIntPipe) bookId: number) {
    const bookResult = await this.booksService.getBookDetail(bookId);
    return new BookDetailDto(bookResult);
  }
}
