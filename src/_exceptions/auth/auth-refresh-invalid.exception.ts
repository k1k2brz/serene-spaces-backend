import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthRefreshInvalidException extends HttpException {
  constructor() {
    super(
      {
        message: '리프레시 토큰이 존재하지 않습니다.',
        code: 'AUTH_REFRESH_INVALID',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
