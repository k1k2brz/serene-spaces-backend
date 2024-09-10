import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '@/user/user.entity';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 주문 생성
  @Post('create')
  async createOrder(
    @Req() req: Request,
    @Body() createOrderDto: { shippingAddress: string; paymentMethod: string },
  ) {
    const user = req.user as User; // 인증된 유저
    const { shippingAddress, paymentMethod } = createOrderDto;
    return this.orderService.createOrder(user, shippingAddress, paymentMethod);
  }

  // 특정 유저의 모든 주문 조회
  @Get()
  async getUserOrders(@Req() req: Request) {
    const user = req.user as User; // 인증된 유저
    return this.orderService.getUserOrders(user);
  }

  // 특정 주문 상세 조회
  @Get(':orderId')
  async getOrderById(@Req() req: Request, @Param('orderId') orderId: number) {
    const user = req.user as User; // 인증된 유저
    return this.orderService.getOrderById(user, orderId);
  }
}
