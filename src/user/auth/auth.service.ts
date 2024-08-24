import { LoginUserDto } from '@/user/dto/login-user.dto';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../token/refresh-token.service';
import { v4 as uuidv4 } from 'uuid';

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

    const jwtOptions = {
      expiresIn: '1h',
      jwtid: uuidv4(),
    };

    const access_token = this.jwtService.sign(payload, jwtOptions);

    const refreshToken =
      await this.refreshTokenService.createRefreshToken(user);

    const decodedToken = this.jwtService.decode(access_token) as any;
    const expiresIn = decodedToken.exp; // 만료 시간 (Unix timestamp)
    const jti = decodedToken.jti; // JWT ID

    const { password, ...rest } = user;

    // 결과 반환
    return {
      message: null,
      user: { ...rest },
      access_token,
      refresh_token: refreshToken.token,
      expiresIn,
      jti,
    };
  }
}
