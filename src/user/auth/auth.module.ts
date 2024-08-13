import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthSharedModule } from '@/user/shared/auth-shared.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    AuthSharedModule, // JwtModule은 AuthSharedModule에서 관리
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
