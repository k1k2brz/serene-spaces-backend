import { HttpException, HttpStatus } from '@nestjs/common';

export class CartAlreadyProductException extends HttpException {
  constructor() {
    super(
      {
        message: '이미 장바구니에 담긴 상품입니다.',
        code: 'CART_ALREADY_PRODUCT',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
