import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { CategoryModel } from './category.entity';
import { CartModel } from './cart.entity';
import { Exclude } from 'class-transformer';

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

  @Column('simple-array', { default: null, name: 'index_list' })
  indexList: string[];

  @Column()
  price: number;

  @Column('date', { name: 'pub_date' })
  pubDate: Date;

  @Exclude()
  @ManyToOne(() => CategoryModel, (category) => category.id, { eager: true })
  category: CategoryModel;

  @Exclude()
  @OneToMany(() => CartModel, (cart) => cart.book)
  carts: CartModel[];

  @Exclude()
  @ManyToMany(() => UserModel, (user) => user.likes, { eager: true })
  @JoinTable()
  liked: UserModel[];
}
