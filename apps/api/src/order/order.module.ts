import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ShareModule } from 'src/share/share.module';

@Module({
  imports: [ShareModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
