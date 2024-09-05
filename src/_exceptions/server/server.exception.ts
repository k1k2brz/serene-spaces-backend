import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerException extends HttpException {
  constructor() {
    super(
      {
        message: '서버에 알 수 없는 오류가 발생했습니다.',
        code: 'SERVER_ERROR',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
