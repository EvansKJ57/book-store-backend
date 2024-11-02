import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookPaginationOptDto } from 'src/dtos/pagination-req.dto';
import { BookModel } from 'src/entities/book.entity';
import { BooksService } from 'src/service/books.service';

const mockBookRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('BookService', () => {
  let bookService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(BookModel),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    bookService = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('getBooks', () => {
    it('should throw a NotFoundException', async () => {
      jest.spyOn(mockBookRepository, 'find').mockResolvedValue([]);

      const dto: BookPaginationOptDto = { take: 10 };

      const { newBooks, ...rest } = dto;

      expect(bookService.getBooks(dto)).rejects.toThrow(NotFoundException);
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        relations: { likes: true, category: true },
        where: {},
        ...rest,
        order: { id: 'ASC' },
      });
    });
  });
});
