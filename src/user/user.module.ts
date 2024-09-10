import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthSharedModule } from '@/_shared/auth-shared.module';
import { ProductCartOrderSharedModule } from '@/_shared/product-cart-order-shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthSharedModule,
    forwardRef(() => ProductCartOrderSharedModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있게 내보냄
})
export class UserModule {}
