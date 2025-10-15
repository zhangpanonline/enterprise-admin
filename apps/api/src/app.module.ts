import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { GlobalModule } from './global/global.module';
import { ShareModule } from './share/share.module';
import { UserModule } from './user/user.module';
import { FuMiddleware1, FuMiddleware2 } from './logger/logger.middleware';
import { UserController } from './user/user.controller';

@Module({
  imports: [UserModule, OrderModule, GlobalModule, ShareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FuMiddleware1, FuMiddleware2).forRoutes(UserController);
  }
}
