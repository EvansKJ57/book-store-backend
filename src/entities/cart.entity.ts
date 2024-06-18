import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { BookModel } from './book.entity';

export type TCartStatus = 'active' | 'purchased' | 'removed';

@Entity('carts')
export class CartModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qty: number;

  @Column()
  bookId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 'active' })
  status: TCartStatus;

  @ManyToOne(() => UserModel, (user) => user.carts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserModel;

  @ManyToOne(() => BookModel, (book) => book.carts)
  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  book: BookModel;
}
