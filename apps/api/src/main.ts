import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalMiddleware } from 'src/logger/logger.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局中间件
  app.use(GlobalMiddleware);
  // 绑定全局验证器
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(80);
}
void bootstrap();
