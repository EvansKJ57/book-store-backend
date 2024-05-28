import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoriesModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  //   @OneToMany(() => BooksModel, (book) => book.category)
  //   books: BooksModel[];
}
