import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './orderitem/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductCartOrderSharedModule } from '@/_shared/product-cart-order-shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    forwardRef(() => ProductCartOrderSharedModule),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
