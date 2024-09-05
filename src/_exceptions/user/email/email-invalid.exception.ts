import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmailException extends HttpException {
  constructor() {
    super(
      {
        message: '이메일 주소가 올바르지 않습니다.',
        code: 'EMAIL_INVALID',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
