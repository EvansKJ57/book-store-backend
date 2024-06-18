import { Module } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { LikesController } from 'src/controller/likes.controller';
import { UserModel } from 'src/entities/user.entity';
import { BookModel } from 'src/entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from './users.module';
import { LikeModel } from 'src/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, BookModel, LikeModel]),
    AuthModule,
    UsersModule,
  ],
  exports: [LikesService],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
