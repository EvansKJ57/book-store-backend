import { Module } from '@nestjs/common';
import { BooksService } from '../service/books.service';
import { BooksController } from '../controller/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModel } from 'src/entities/book.entity';
import { CategoryModel } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookModel, CategoryModel])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
