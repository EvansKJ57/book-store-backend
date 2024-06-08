import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from 'src/entities/cart.entity';
import { Repository } from 'typeorm';
import { BookModel } from 'src/entities/book.entity';
import { UserModel } from 'src/entities/user.entity';
import { CreateCartDto } from 'src/dtos/cart.dto';

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
    const cartObj = this.cartRepository.create({
      book,
      user,
      qty: dto.qty,
    });
    const result = await this.cartRepository.save(cartObj);
    return result;
  }

  async findAll(userId: number) {
    const carts = await this.cartRepository.find({
      where: { userId, status: 'active' },
    });

    return carts;
  }

  update() {}

  async remove(cartId: number) {
    const foundCart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
    });

    if (!foundCart || foundCart.status === 'removed') {
      throw new BadRequestException(
        '해당 카트는 존재하지 않거나 이미 삭제 되었음',
      );
    }
    const softRemoved = this.cartRepository.create({
      ...foundCart,
      status: 'removed',
    });
    const removed = await this.cartRepository.save(softRemoved);

    return removed;
  }
}
