import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor() {
    super(
      { message: '상품을 찾을 수 없습니다.', code: 'PRODUCT_NOT_FOUND' },
      HttpStatus.NOT_FOUND,
    );
  }
}
