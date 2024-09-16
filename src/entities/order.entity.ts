import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { OrderDetailModel } from './orderDetail.entity';
import { DeliveryModel } from './delivery.entity';

@Entity('orders')
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, (user) => user.orders)
  user: UserModel;

  @ManyToOne(() => DeliveryModel, (delivery) => delivery.orders)
  delivery: DeliveryModel;

  @CreateDateColumn()
  created_date: Date;

  @OneToMany(() => OrderDetailModel, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  order_details: OrderDetailModel[];
}
