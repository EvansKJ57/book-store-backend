import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { BookModel } from './book.entity';
import { Expose } from 'class-transformer';

@Entity('likes')
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

  @UpdateDateColumn()
  updated_date: Date;

  @CreateDateColumn()
  created_date: Date;
}
