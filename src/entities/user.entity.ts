import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartModel } from './cart.entity';
import { LikeModel } from './like.entity';
import { Expose } from 'class-transformer';
import { OrderModel } from './order.entity';

export type TProvider = 'LOCAL' | 'GOOGLE';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  password: string;

  @Expose()
  @OneToMany(() => CartModel, (cart) => cart.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  carts: CartModel[];

  @OneToMany(() => LikeModel, (like) => like.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  liked: LikeModel[];

  @OneToMany(() => OrderModel, (order) => order.user, { cascade: true })
  orders: OrderModel[];

  @Column({ default: 'LOCAL' })
  provider: TProvider;

  @Column({ default: null })
  provider_sub: string | null;
}
