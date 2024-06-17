import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
