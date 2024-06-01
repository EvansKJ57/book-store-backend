import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { BookModel } from './book.entity';
import { Exclude } from 'class-transformer';

export type TCartStatus = 'active' | 'purchased' | 'removed';

@Entity()
export class CartModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qty: number;

  @Exclude()
  @ManyToOne(() => UserModel, (user) => user.carts, {
    cascade: true,
  })
  user: UserModel;

  @Exclude()
  @ManyToOne(() => BookModel, (book) => book.carts, {
    cascade: true,
  })
  book: BookModel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 'active' })
  status: TCartStatus;
}
