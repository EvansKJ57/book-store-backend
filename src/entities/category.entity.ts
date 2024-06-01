import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
