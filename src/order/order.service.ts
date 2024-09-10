import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Cart } from '@/cart/cart.entity';
import { User } from '@/user/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  // 주문 생성
  async createOrder(
    user: User,
    shippingAddress: string,
    paymentMethod: string,
  ): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: { user },
      relations: ['items', 'items.product'],
    });
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderItems = cart.items.map((cartItem) => ({
      product: cartItem.product,
      quantity: cartItem.quantity,
      price: cartItem.price,
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

    const order = this.orderRepository.create({
      user,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    return this.orderRepository.save(order);
  }

  // 특정 유저의 모든 주문 조회
  async getUserOrders(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user },
      relations: ['items', 'items.product'],
    });
  }

  // 특정 주문 조회
  async getOrderById(user: User, orderId: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id: orderId, user },
      relations: ['items', 'items.product'],
    });
  }
}
