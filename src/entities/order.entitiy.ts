import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class EntityModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserModel, (user) => user.id)
  userId: UserModel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  address: string;

  @Column()
  receiver: string;
}
