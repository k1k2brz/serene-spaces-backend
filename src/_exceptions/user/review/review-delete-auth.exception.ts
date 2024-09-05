import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewDeleteAuthException extends HttpException {
  constructor() {
    super(
      {
        message: '리뷰를 삭제할 권한이 없습니다.',
        code: 'REVIEW_DELETE_AUTH',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
