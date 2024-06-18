import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderModel } from './order.entity';

@Entity('deliveries')
export class DeliveryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 100 })
  receiver: string;

  @Column({ length: 20 })
  contact: string;

  @OneToMany(() => OrderModel, (order) => order.delivery)
  orders: OrderModel[];
}
