import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalMiddleware } from 'src/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局中间件
  app.use(GlobalMiddleware);
  await app.listen(80);
}
void bootstrap();
