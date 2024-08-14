import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { User } from '@/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { AccessToken } from './access-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: User): Promise<RefreshToken> {
    // 기존 리프레시 토큰을 무효화(삭제)
    await this.refreshTokenRepository.delete({ user });

    const refreshToken = this.refreshTokenRepository.create({
      token: uuidv4(),
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async createAccessToken(
    user: User,
    refreshToken: RefreshToken,
  ): Promise<AccessToken> {
    // 모든 이전의 액세스 토큰을 무효화
    await this.accessTokenRepository.update(
      { user, isValid: true },
      { isValid: false },
    );

    // 새로운 액세스 토큰 생성
    const accessToken = this.accessTokenRepository.create({
      token: uuidv4(),
      user,
      refreshToken,
    });

    return this.accessTokenRepository.save(accessToken);
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
