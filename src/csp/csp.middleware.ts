import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CspMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const cspDomain = this.configService.get<string>('DOMAIN');

    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' ${cspDomain}; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; frame-src 'none';`,
    );
    // 'self'는 현재 도메인에서만 리소스를 로드할 수 있도록 제한.
    // script-src 'self'는 현재 도메인에서만 스크립트가 로드될 수 있도록 함.
    next();
  }
}
