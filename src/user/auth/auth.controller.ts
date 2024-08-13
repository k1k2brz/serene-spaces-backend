import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../token/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') token: string) {
    const refreshToken = await this.refreshTokenService.findToken({ token });
    console.log(refreshToken);

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = refreshToken.user;
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return {
      message: 'Token refreshed successfully',
      access_token,
    };
  }
}
