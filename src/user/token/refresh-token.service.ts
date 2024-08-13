import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { User } from '@/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      token: uuidv4(),
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async findToken(token: Partial<RefreshToken>): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: token,
      relations: ['user'], // user 관계를 명시적으로 로드
    });
  }

  async deleteToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
