import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModel } from 'src/entities/books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BooksModel])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
