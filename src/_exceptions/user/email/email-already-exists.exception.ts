import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(
      { message: '이미 등록된 이메일입니다.', code: 'EMAIL_ALREADY_EXISTS' },
      HttpStatus.CONFLICT,
    );
  }
}
