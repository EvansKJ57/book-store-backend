import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriesModel } from './categories.entity';

@Entity()
export class BooksModel {
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

  @Column('simple-array', { default: null })
  index_list: string[];

  @Column()
  price: number;

  @Column('date')
  pub_date: Date;

  @Column({ default: 0 })
  likes?: number;

  @Column({ default: 0 })
  liked?: number;

  @ManyToOne(() => CategoriesModel, (category) => category.id)
  category: CategoriesModel;
}
