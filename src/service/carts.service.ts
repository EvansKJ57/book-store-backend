import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { BookModel } from 'src/entities/book.entity';
import { plainToInstance } from 'class-transformer';
import { UserModel } from 'src/entities/user.entity';
import { CartsResDto, CreateCartDto } from 'src/dtos/cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartModel)
    private readonly cartRepository: Repository<CartModel>,
    @InjectRepository(BookModel)
    private readonly bookRepository: Repository<BookModel>,
  ) {}

  async create(dto: CreateCartDto, user: UserModel) {
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

  update() {}

  async remove(cartId: number) {
    const foundCart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
    });

    if (!foundCart) {
      throw new BadRequestException('해당 카트는 존재하지 않음');
    }
    const softRemoved = this.cartRepository.create({
      ...foundCart,
      status: 'removed',
    });
    const result = await this.cartRepository.save(softRemoved);
    return { cartId: result.id, msg: '카트 정상 삭제됨' };
  }
}
