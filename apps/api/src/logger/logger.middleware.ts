import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';

// 这是类中间件
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject(UserService) private userService: UserService;
  use(req: Request, res: Response, next: NextFunction) {
    console.log('before 类中间件');
    console.log(
      '中间件调用了UserService.findAll结果：',
      this.userService.findAll(),
    );
    next();
    console.log('after 类中间件');
  }
}

// 当中间件不需要成员、没有额外的方法或依赖时，应优先考虑函数式中间件，类似于Vue没有状态的组件应该使用函数式组件
export function FuMiddleware1(req: Request, res: Response, next: NextFunction) {
  console.log('before 函数式中间件1');
  next();
  console.log('after 函数式中间件1');
}
export function FuMiddleware2(req: Request, res: Response, next: NextFunction) {
  console.log('before 函数式中间件2');
  next();
  console.log('after 函数式中间件2');
}

export function GlobalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('before 全局中间件');
  next();
  console.log('after 全局中间件');
}
