import { AuthService } from '@/user/auth/auth.service';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../user/token/refresh-token.entity';
import { RefreshTokenService } from '../user/token/refresh-token.service';
import { AccessToken } from '../user/token/access-token.entity';

// 순환참조 방지용
@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, AccessToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '14d' },
      }),
    }),
  ],
  providers: [UserService, AuthService, RefreshTokenService],
  exports: [UserService, AuthService, JwtModule, RefreshTokenService],
})
export class AuthSharedModule {}
