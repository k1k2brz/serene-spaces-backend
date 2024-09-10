import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartItem } from './cartitem/cart-item.entity';
import { CartController } from './cart.controller';
import { ProductCartOrderSharedModule } from '@/_shared/product-cart-order-shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    forwardRef(() => ProductCartOrderSharedModule),
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService, TypeOrmModule],
})
export class CartModule {}
