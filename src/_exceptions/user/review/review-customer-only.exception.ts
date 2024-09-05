import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewCustomerOnlyException extends HttpException {
  constructor() {
    super(
      {
        message: '리뷰는 유저만이 작성할 수 있습니다.',
        code: 'REVIEW_CUSTOMER_ONLY',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
