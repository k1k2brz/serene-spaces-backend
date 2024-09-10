import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductUpdateUnAuthorizedException extends HttpException {
  constructor() {
    super(
      {
        message: '상품을 업데이트 할 권한이 없습니다.',
        code: 'PRODUCT_UPDATE_UNAUTHORIZED',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
