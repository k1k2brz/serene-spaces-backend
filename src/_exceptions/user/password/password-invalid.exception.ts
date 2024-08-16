import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      { message: '비밀번호가 올바르지 않습니다.', code: 'PASSWORD_INVALID' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
