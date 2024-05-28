import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksModel } from 'src/entities/books.entity';
import { Repository } from 'typeorm';
import { mockBooksData } from '../entities/mock-data/mockBook';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BooksModel)
    private readonly bookRepository: Repository<BooksModel>,
  ) {}
  /**
   *목 데이터 넣기
   */
  generateTestBooks() {
    for (let i = 0; i < mockBooksData.length; i++) {
      this.bookRepository.save(mockBooksData[i]);
    }
    return;
  }

  async getBooks() {
    return this.bookRepository.find({
      relations: ['category'],
    });
  }
  async getBookDetail(id: number) {
    return this.bookRepository.find({
      where: {
        id,
      },
      relations: ['category'],
    });
  }
}
