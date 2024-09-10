import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '@/user/user.entity';
import { OrderItem } from './orderitem/order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal')
  totalPrice: number;

  @Column('varchar', { default: 'pending' })
  status: string; // 주문 상태 (ex: 'pending', 'shipped', 'delivered', 'cancelled')

  @Column()
  shippingAddress: string;

  @Column()
  paymentMethod: string; // 결제 방식 (ex: 'credit_card', 'paypal')
}
