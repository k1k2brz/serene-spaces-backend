import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CspMiddleware } from './csp/csp.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역적으로 환경 변수를 사용할 수 있게 설정
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('TYPEORM_SYNC'), // 개발 중에만 true로 설정, 실제 운영에서는 false로 변경
      }),
    }),
    UserModule, // 유저 모듈
    AuthModule, // JWT 모듈
    ProductModule, // Product 모듈
    ReviewModule, // Review 모듈
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CspMiddleware).forRoutes('*'); // CSP 적용
    // consumer.apply(RequestLoggerMiddleware).forRoutes('*'); // logger
  }
}
