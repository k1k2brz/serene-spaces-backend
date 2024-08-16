import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor() {
    super(
      { message: '리뷰를 찾을 수 없습니다.', code: 'REVIEW_NOT_FOUND' },
      HttpStatus.NOT_FOUND,
    );
  }
}
