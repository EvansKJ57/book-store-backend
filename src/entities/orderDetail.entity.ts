import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderModel } from './order.entity';
import { BookModel } from './book.entity';

@Entity('order_details')
export class OrderDetailModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qty: number;

  @Column()
  bookId: number;

  @ManyToOne(() => OrderModel, (order) => order.orderDetails)
  order: OrderModel;

  @ManyToOne(() => BookModel, (book) => book.orderDetails)
  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  book: BookModel;
}
