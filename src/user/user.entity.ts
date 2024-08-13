import { UserRole } from '@/_types';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    default: 'user', // 기본값 설정
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;
}
