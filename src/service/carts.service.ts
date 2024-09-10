import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel, TCartStatus } from 'src/entities/cart.entity';
import { DeepPartial, In, QueryRunner, Repository } from 'typeorm';
import { BookModel } from 'src/entities/book.entity';
import { CreateCartDto } from 'src/dtos/cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartModel)
    private readonly cartRepository: Repository<CartModel>,
    @InjectRepository(BookModel)
    private readonly bookRepository: Repository<BookModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(CartModel) : this.cartRepository;
  }

  async createCart(dto: CreateCartDto, userId: number): Promise<CartModel> {
    const book = await this.bookRepository.findOne({
      where: { id: dto.bookId },
    });
    const cartObj = this.cartRepository.create({
      book,
      user: {
        id: userId,
      },
      qty: dto.qty,
    });
    const result = await this.cartRepository.save(cartObj);
    return result;
  }

  async findActiveCarts(userId: number): Promise<CartModel[]> {
    const carts = await this.cartRepository.find({
      where: { userId, status: 'active' },
    });

    return carts;
  }

  async findActiveByCartId(
    userId: number,
    carts: number[],
  ): Promise<CartModel[]> {
    const foundCarts = await this.cartRepository.find({
      where: {
        userId,
        id: In(carts),
        status: 'active',
      },
    });

    if (!foundCarts.length) {
      throw new BadRequestException('해당 물품은 카트에 없습니다.');
    }
    return foundCarts;
  }

  async updateCartsStatus(
    carts: CartModel[],
    status: TCartStatus,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    const updatedCarts: DeepPartial<CartModel>[] = carts.map((cart) => ({
      ...cart,
      status,
    }));

    return repository.save(updatedCarts);
  }

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
