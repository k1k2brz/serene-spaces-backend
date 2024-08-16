import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNameRequiredException extends HttpException {
  constructor() {
    super(
      {
        message: 'Vendor 계정에는 회사명이 필수입니다.',
        code: 'COMPANY_NAME_REQUIRED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
