import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// JWT 생성하고 반환하는 역할만 담당함.

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
