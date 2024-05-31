import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearToken.guard';
import { User } from 'src/decorator/user.decorator';
import { LikesService } from 'src/service/likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id')
  @UseGuards(AccessTokenGuard)
  addLike(@Param('id') bookId: number, @User('id') userId: number) {
    return this.likesService.addLike({ bookId, userId });
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteLike(@Param('id') bookId: number, @User('id') userId: number) {
    return this.likesService.removeLike({ bookId, userId });
  }
}
