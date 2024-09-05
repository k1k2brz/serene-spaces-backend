import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthInvalidException extends HttpException {
  constructor() {
    super(
      { message: '인증 토큰이 존재하지 않습니다.', code: 'AUTH_INVALID' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
