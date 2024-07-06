import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { User } from 'src/decorator/user.decorator';
import { LikesService } from 'src/service/likes.service';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id')
  @UseGuards(AccessTokenGuard)
  addLike(
    @Param('id', ParseIntPipe) bookId: number,
    @User('id') userId: number,
  ) {
    return this.likesService.addLike({ bookId, userId });
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteLike(
    @Param('id', ParseIntPipe) bookId: number,
    @User('id') userId: number,
  ) {
    await this.likesService.removeLike({ bookId, userId });
    return { bookId, msg: `해당 도서 좋아요 삭제 완료` };
  }
}
