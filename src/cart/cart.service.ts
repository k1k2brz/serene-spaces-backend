import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@/product/product.entity';
import { CartItem } from './cartitem/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 유저 ID로 장바구니 가져오기
  async getCart(userId: number): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  // 장바구니에 상품 추가
  async addToCart(userId: number, id: number, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });
    if (!cart) {
      const user = await this.cartRepository.findOne({ where: { id } });
      cart = this.cartRepository.create({ user, items: [] });
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      quantity,
      price: product.price * quantity,
    });

    cart.items.push(cartItem);
    await this.cartRepository.save(cart);
    return cart;
  }

  // 장바구니에서 상품 삭제
  async removeFromCart(userId: number, itemId: number): Promise<void> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    cart.items.splice(itemIndex, 1);
    await this.cartRepository.save(cart);
  }

  // 장바구니 아이템 수량 업데이트
  async updateCartItem(
    userId: number,
    itemId: number,
    quantity: number,
  ): Promise<void> {
    const cart = await this.getCart(userId);
    const item = cart.items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }
    item.quantity = quantity;
    await this.cartRepository.save(cart);
  }
}
