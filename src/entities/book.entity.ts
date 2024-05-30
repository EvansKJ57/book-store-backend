import {
  AfterLoad,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { CategoryModel } from './category.entity';

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

  @ManyToOne(() => CategoryModel, (category) => category.id, {
    eager: true,
  })
  category: CategoryModel;

  @ManyToMany(() => UserModel, (user) => user.likes)
  @JoinTable()
  liked: UserModel[];

  likesCounts: number;

  @AfterLoad()
  countLikes() {
    return (this.likesCounts = this.liked ? this.liked.length : 0);
  }
}
