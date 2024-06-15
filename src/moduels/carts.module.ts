import { Module } from '@nestjs/common';
import { CartsController } from '../controller/carts.controller';
import { CartsService } from 'src/service/carts.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { UsersModule } from './users.module';
import { BooksModule } from './books.module';
import { BookModel } from 'src/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartModel, BookModel]),
    AuthModule,
    UsersModule,
    BooksModule,
  ],
  exports: [CartsService],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
