import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("share")
  getShare(): string {
    return this.orderService.getShare();
  }

  @Get('global')
  getGlobal(): string {
    return this.orderService.getGlobal()
  }
}
