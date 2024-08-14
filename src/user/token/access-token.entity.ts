import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../user.entity';

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ default: true })
  isValid: boolean;

  @ManyToOne(() => User, (user) => user.accessTokens, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => RefreshToken, (refreshToken) => refreshToken.accessTokens, {
    onDelete: 'CASCADE',
  })
  refreshToken: RefreshToken;
}
