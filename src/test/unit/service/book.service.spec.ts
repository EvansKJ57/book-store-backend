import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookPaginationOptDto } from 'src/dtos/pagination-req.dto';
import { BookModel } from 'src/entities/book.entity';
import { BooksService } from 'src/service/books.service';

const mockBook = [
  { id: 1, title: 'new-books' },
  { id: 2, title: 'new-book2' },
];

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
    it('should return a list of books', async () => {
      const dto: BookPaginationOptDto = { take: 10 };

      jest.spyOn(mockBookRepository, 'find').mockResolvedValue(mockBook);

      const result = await bookService.getBooks(dto);
      expect(result).toEqual(mockBook);
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        relations: { likes: true, category: true },
        where: {},
        take: dto.take,
        order: { id: 'ASC' },
      });
    });

    it('should return a list of books with newBooks filter', async () => {
      const dto: BookPaginationOptDto = { take: 10, newBooks: true };

      jest.spyOn(mockBookRepository, 'find').mockResolvedValue(mockBook);

      const result = await bookService.getBooks(dto);

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            pubDate: expect.objectContaining({
              _type: 'between',
              _value: expect.any(Array),
            }),
          },
        }),
      );
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(mockBookRepository, 'find').mockResolvedValue([]);

      const dto: BookPaginationOptDto = { take: 10 };

      expect(bookService.getBooks(dto)).rejects.toThrow(NotFoundException);
      expect(mockBookRepository.find).toHaveBeenCalled();
    });
  });

  describe('getBookDetail', () => {
    it('should return a book', async () => {
      const bookDetail = { id: 1, title: 'books', price: 1000 };
      jest.spyOn(mockBookRepository, 'findOne').mockResolvedValue(bookDetail);

      const result = await bookService.getBookDetail(1);

      expect(result).toEqual(bookDetail);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { likes: true, category: true },
      });
      expect(mockBookRepository.findOne).not.toHaveBeenCalledWith({
        where: { id: 2 },
        relations: { likes: true, category: true },
      });
    });
    it('should throw a NotFoundException Error', async () => {
      jest.spyOn(mockBookRepository, 'findOne').mockResolvedValue(null);

      expect(bookService.getBookDetail(1)).rejects.toThrow(NotFoundException);
      expect(mockBookRepository.findOne).toHaveBeenCalled();
    });
  });
});
