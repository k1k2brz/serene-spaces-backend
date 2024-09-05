import { Review } from '@/review/review.entity';
import { User } from '@/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  description: string;

  @Column('decimal') // 숫자 타입 중에서 소수점을 포함한 고정 소수점 수를 저장
  price: number;

  @Column('simple-array') // 쉼표로 구분된 문자열로 배열을 저장 (ex: 배열이 image1.jpg,image2.jpg,image3.jpg로 저장)
  images: string[];

  @Column()
  companyName: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.products)
  vendor: User;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
