import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // 유효성 검사 실패 시 모든 에러 메시지를 반환
  //     exceptionFactory: (validationErrors = []) => {
  //       const errors = validationErrors.map((error) => ({
  //         field: error.property,
  //         errors: Object.values(error.constraints),
  //       }));
  //       return new HttpException(
  //         {
  //           message: '입력값 유효성 검사 실패',
  //           code: 'VALIDATION_ERROR',
  //           errors,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     },
  //   }),
  // );

  const options = new DocumentBuilder()
    .setTitle('Serene Spaces API')
    .setDescription('Serene Spaces Swagger')
    .setVersion('1.0')
    .addServer('http://localhost:3065/', 'Local environment')
    // .addServer('https://staging.yourapi.com/', 'Staging')
    // .addServer('https://production.yourapi.com/', 'Production')
    .addTag('Serene Spaces API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: corsOrigin, // frontend 도메인
  });
  await app.listen(process.env.PORT || 3065);
}
bootstrap();
