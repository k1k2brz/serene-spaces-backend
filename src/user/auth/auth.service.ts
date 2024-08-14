import { LoginUserDto } from '@/user/dto/login-user.dto';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    // 유저 검증
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // JWT 토큰 생성
    const payload = {
      email: user.email,
      sub: user.id,
      tokenVersion: user.tokenVersion,
    };
    const access_token = this.jwtService.sign(payload);

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(user);

    // 결과 반환
    return {
      message: 'Login successful',
      user, // 유저 정보 반환
      access_token,
      refresh_token: refreshToken.token,
    };
  }
}
