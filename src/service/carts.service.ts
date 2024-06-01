import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { BookModel } from 'src/entities/book.entity';
import { CreateCartDto } from 'src/dtos/req/cart.req.dto';
import { plainToInstance } from 'class-transformer';
import { CartsResDto } from 'src/dtos/res/cart.res.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartModel)
    private readonly cartRepository: Repository<CartModel>,
    @InjectRepository(BookModel)
    private readonly bookRepository: Repository<BookModel>,
  ) {}
  async create(dto: CreateCartDto, user) {
    const book = await this.bookRepository.findOne({
      where: { id: dto.bookId },
    });
    const cartRow = this.cartRepository.create({
      book,
      user,
      qty: dto.qty,
    });
    const result = await this.cartRepository.save(cartRow);
    return result;
  }

  async findAll(userId: number) {
    const results = await this.cartRepository.find({
      where: { user: { id: userId }, status: 'active' },
      relations: {
        book: true,
        user: true,
      },
    });

    const carts = results.map((result) => plainToInstance(CartsResDto, result));

    return carts;
  }

  findOne() {}

  update() {}

  remove() {}
}
