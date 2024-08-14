import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../token/refresh-token.service';
import { UserService } from '../user.service';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token') token: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization header is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const accessToken = authHeader.split(' ')[1]; // Bearer token 형식에서 토큰 추출

    // 액세스 토큰 검증
    let payload;
    try {
      payload = this.jwtService.verify(accessToken);
    } catch (err) {
      throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }

    const refreshToken = await this.refreshTokenService.findToken({ token });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 리프레시 토큰이 액세스 토큰의 소유자와 일치하는지 확인
    if (refreshToken.user.id !== payload.sub) {
      throw new HttpException(
        'Refresh token does not match access token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = refreshToken.user;
    user.tokenVersion += 1;
    await this.userService.save(user);

    // 새로운 액세스 토큰 생성
    const newAccessToken = await this.refreshTokenService.createAccessToken(
      user,
      refreshToken,
    );

    const access_token = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        tokenVersion: newAccessToken.user.tokenVersion,
      },
      {
        expiresIn: '30m',
      },
    );

    return {
      message: 'Token refreshed successfully',
      access_token,
      refresh_token: refreshToken.token,
    };
  }
}
