import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeModel } from 'src/entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeModel)
    private readonly likeRepository: Repository<LikeModel>,
  ) {}

  async addLike({ bookId, userId }) {
    const isAlreadyLiked = await this.likeRepository.find({
      where: {
        userId,
        bookId,
      },
    });
    if (isAlreadyLiked.length) {
      throw new BadRequestException('이미 좋아요 되어있음');
    }

    const result = await this.likeRepository.save({ bookId, userId });
    return result;
  }

  async removeLike({ bookId, userId }) {
    const isLiked = await this.likeRepository.find({
      where: {
        userId,
        bookId,
      },
    });
    if (!isLiked.length) {
      throw new BadRequestException('이미 좋아요 안되어 있음');
    }
    const result = await this.likeRepository.delete({ bookId, userId });
    if (result.affected === 0) {
      throw new InternalServerErrorException('좋아요 삭제 실패');
    }

    return result;
  }
}
