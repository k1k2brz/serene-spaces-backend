import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthTokenMatchException extends HttpException {
  constructor() {
    super(
      {
        message: '리프레시 토큰이 액세스 토큰의 소유자와 일치하지 않습니다.',
        code: 'AUTH_TOKEN_MATCH',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
