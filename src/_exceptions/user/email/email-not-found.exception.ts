import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: '이메일 주소가 존재하지 않습니다.',
        code: 'EMAIL_INVALID',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
