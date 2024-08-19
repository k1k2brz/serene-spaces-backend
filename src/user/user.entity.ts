import { UserRole } from '@/_types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshToken } from './token/refresh-token.entity';
import { AccessToken } from './token/access-token.entity';
import { Product } from '@/product/product.entity';
import { Review } from '@/review/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: 'customer', // 기본값 설정
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  logoUrl: string; // 회사 로고

  @Column({ default: 0 })
  tokenVersion: number;

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];
}
