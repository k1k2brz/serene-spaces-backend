import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@/product/product.entity';
import { CartItem } from './cartitem/cart-item.entity';
import { User } from '@/user/user.entity';
import { ProductNotFoundException } from '@/_exceptions/product/product-not-found.exception';
import { CartAlreadyProductException } from '@/_exceptions/cart/cart-already-product.exception';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 유저 ID로 장바구니 가져오기
  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    // 카트가 없으면 빈 객체 반환
    if (!cart) {
      return {
        id: 0,
        user: null,
        items: [],
      };
    }

    return cart;
  }

  // 장바구니에 상품 추가
  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<{ message: string; code: string; cart?: Cart }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new ProductNotFoundException();
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save(cart); // 새 장바구니 저장
    }

    // 장바구니 내 중복된 상품 찾기
    let cartItem = cart.items.find((item) => item.product.id === productId);

    if (cartItem) {
      throw new CartAlreadyProductException();
    } else {
      // 카트에 없는 상품이면 새로 추가
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
        price: product.price * quantity,
      });
      cart.items.push(cartItem);

      await this.cartRepository.save(cart);

      // 장바구니를 새로고침
      cart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });

      return { message: '장바구니 담기 성공', code: null, cart };
    }
  }

  // 장바구니에서 상품 삭제
  async deleteFromCart(userId: number, itemId: number): Promise<void> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
    });
    if (!item) {
      throw new Error('해당 아이템이 존재하지 않음');
    }
    await this.cartItemRepository.remove(item);
  }

  // 장바구니 아이템 수량 업데이트
  async updateCartItem(
    userId: number,
    itemId: number,
    quantity: number,
  ): Promise<void> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
    });
    if (!item) {
      throw new Error('해당 아이템이 존재하지 않음');
    }
    item.quantity = quantity;
    await this.cartItemRepository.save(item);
  }
}
