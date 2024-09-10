import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductDeleteUnAuthorizedException extends HttpException {
  constructor() {
    super(
      {
        message: '상품을 삭제할 권한이 없습니다.',
        code: 'PRODUCT_DELETE_UNAUTHORIZED',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
