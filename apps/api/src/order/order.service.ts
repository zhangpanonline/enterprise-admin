import { Injectable, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  // 使用构造函数注入
  // constructor(private userService: UserService) {}

  // 依赖注入之属性注入共享的服务
  @Inject(UserService) private userService: UserService;

  getOrderDesc(): string {
    const name = this.userService.getUserName();
    return `订单ID: xxx，下单人：${name}`;
  }
}
