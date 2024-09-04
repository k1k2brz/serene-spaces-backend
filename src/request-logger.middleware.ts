import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    console.log('Body:', req.body); // POST 요청의 바디 확인
    console.log('Query:', req.query); // GET 요청의 쿼리 파라미터 확인
    console.log('Headers:', req.headers); // 요청 헤더 확인
    next();
  }
}
