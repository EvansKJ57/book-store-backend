import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryModel } from './category.entity';
import { CartModel } from './cart.entity';
import { LikeModel } from './like.entity';
import { OrderDetailModel } from './orderDetail.entity';

@Entity()
export class BookModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  img: number;

  @Column()
  form: string;

  @Column()
  isbn: string;

  @Column()
  summary: string;

  @Column()
  detail: string;

  @Column()
  author: string;

  @Column()
  pages: number;

  @Column('simple-array', { default: [] })
  indexList: string[];

  @Column()
  price: number;

  @Column('date')
  pubDate: Date;

  @ManyToOne(() => CategoryModel, (category) => category.id)
  category: CategoryModel;

  @OneToMany(() => CartModel, (cart) => cart.book)
  carts: CartModel[];

  @OneToMany(() => LikeModel, (like) => like.book)
  likes: LikeModel[];

  @OneToMany(() => OrderDetailModel, (orderDetail) => orderDetail.book, {
    cascade: true,
  })
  orderDetails: OrderDetailModel[];
}
