import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user.entity';
import { AccessToken } from './access-token.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isValid: boolean; // 토큰 유효성 플래그

  @OneToMany(() => AccessToken, (accessToken) => accessToken.refreshToken)
  accessTokens: AccessToken[];
}
