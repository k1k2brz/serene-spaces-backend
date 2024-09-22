import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request } from 'express';
import { JwtAuthGuard } from '@/_lib/guard/jwt.auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 현재 유저의 장바구니 조회
  @Get(':id')
  async getCart(@Req() req: Request) {
    const userId = req.user.id;
    const cart = await this.cartService.getCart(userId);

    return cart;
  }

  // 장바구니에 상품 추가
  @Post('add')
  async addToCart(
    @Req() req: Request,
    @Body() addToCartDto: { productId: number; quantity: number },
  ) {
    const userId = req.user.id;
    const { productId, quantity } = addToCartDto;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  // 장바구니에서 상품 삭제
  @Delete('delete/:itemId')
  async deleteFromCart(@Req() req: Request, @Param('itemId') itemId: number) {
    const userId = req.user.id;
    return this.cartService.deleteFromCart(userId, itemId);
  }

  // 장바구니 아이템 수량 업데이트
  @Patch('update/:itemId')
  async updateCartItem(
    @Req() req: Request,
    @Param('itemId') itemId: number,
    @Body() updateCartDto: { quantity: number },
  ) {
    const userId = req.user.id;
    const { quantity } = updateCartDto;
    return this.cartService.updateCartItem(userId, itemId, quantity);
  }
}
