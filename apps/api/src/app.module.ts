import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { GlobalModule } from './global/global.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [UserModule, OrderModule, GlobalModule, ShareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}