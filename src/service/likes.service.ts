import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookModel } from 'src/entities/book.entity';
import { UserModel } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(BookModel)
    private readonly bookRepository: Repository<BookModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
  async addLike({ bookId, userId }) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new BadRequestException('해당 도서 없음');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const isAlreadyLike = book.liked.find(
      (likedUser) => likedUser.id === userId,
    );
    if (isAlreadyLike) {
      throw new BadRequestException('이미 좋아요 누름');
    }

    const addLikeBook = this.bookRepository.create({
      ...book,
      liked: [...book.liked, user],
    });

    const result = await this.bookRepository.save(addLikeBook);
    return { bookId: result.id, msg: '좋아요 추가 완료' };
  }

  async removeLike({ bookId, userId }) {
    const book = await this.bookRepository.findOne({
      where: {
        id: bookId,
      },
    });
    if (!book) {
      throw new BadRequestException('해당 도서 없음');
    }
    const removedList = book.liked.filter(
      (likedUser) => likedUser.id !== userId,
    );
    if (book.liked.length === removedList.length) {
      throw new BadRequestException('좋아요 안 되어 있음');
    }
    const updateBook = this.bookRepository.create({
      ...book,
      liked: removedList,
    });
    const result = await this.bookRepository.save(updateBook);
    return { bookid: result.id, msg: '좋아요 삭제 완료' };
  }
}
