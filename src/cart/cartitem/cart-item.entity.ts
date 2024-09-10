import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Product } from '@/product/product.entity';
import { Cart } from '../cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number; // 상품의 개별 가격 (상품 가격 * 수량)
}
