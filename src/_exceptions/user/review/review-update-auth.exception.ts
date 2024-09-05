import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewUpdateAuthException extends HttpException {
  constructor() {
    super(
      {
        message: '리뷰를 업데이트할 권한이 없습니다.',
        code: 'REVIEW_UPDATE_AUTH',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
