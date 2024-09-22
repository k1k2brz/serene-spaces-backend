import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/product/product.entity';
import { Cart } from '@/cart/cart.entity';
import { CartItem } from '@/cart/cartitem/cart-item.entity';
import { Order } from '@/order/order.entity';
import { OrderItem } from '@/order/orderitem/order-item.entity';
import { UserModule } from '@/user/user.module';
import { User } from '@/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Cart, CartItem, Order, OrderItem]),
    forwardRef(() => UserModule),
  ],
  exports: [TypeOrmModule],
})
export class ProductCartOrderSharedModule {}
