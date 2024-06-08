import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserModel } from './user.entity';
import { BookModel } from './book.entity';
import { Expose } from 'class-transformer';

@Entity()
export class LikeModel {
  @Expose()
  @PrimaryColumn()
  bookId: number;

  @Expose()
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => UserModel, (user) => user.liked)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserModel;

  @ManyToOne(() => BookModel, (book) => book.likes)
  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  book: BookModel;
}
