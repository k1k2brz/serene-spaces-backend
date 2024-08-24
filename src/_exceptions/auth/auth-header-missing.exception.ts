import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthHeaderMissingException extends HttpException {
  constructor() {
    super(
      { message: '인증 헤더를 찾을 수 없습니다.', code: 'AUTH_HEADER_MISSING' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
