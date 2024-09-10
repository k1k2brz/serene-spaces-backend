import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

import { User } from '@/user/user.entity';
import { CartItem } from './cartitem/cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
