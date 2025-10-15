import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from 'src/logger/logger.middleware';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 针对此模块的所有路由绑定中间件
    // consumer.apply(LoggerMiddleware).forRoutes('*');
    // 指定中间件的路由和请求方式
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '/user',
      method: RequestMethod.GET,
    });
  }
}
