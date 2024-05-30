import { Module } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { LikesController } from 'src/controller/likes.controller';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
