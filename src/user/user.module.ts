import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthSharedModule } from '@/shared/auth-shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthSharedModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있게 내보냄
})
export class UserModule {}
