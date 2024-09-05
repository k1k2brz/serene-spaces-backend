import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      { message: '유저를 찾을 수 없습니다.', code: 'USER_NOT_FOUND' },
      HttpStatus.NOT_FOUND,
    );
  }
}
