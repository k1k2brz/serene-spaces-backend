import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '@/user/user.entity';
import { Product } from '@/product/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewText: string;

  @Column('decimal')
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  customer: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
