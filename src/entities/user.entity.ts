import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BookModel } from './book.entity';
import { CartModel } from './cart.entity';

export enum TProvider {
  local = 'LOCAL',
  google = 'GOOGLE',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => CartModel, (cart) => cart.user)
  carts: CartModel[];

  @ManyToMany(() => BookModel, (book) => book.liked)
  likes: BookModel[];

  // @Column('enum', { enum: TProvider, default: TProvider.local })
  // provider: TProvider;

  // @Column({ default: null })
  // provider_sub: string | null;
}
