import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { Observable, from } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TimeoutInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('name')
  @UseInterceptors(AuthInterceptor)
  getNameList(): Observable<string> {
    return from(['张三', '李四四', 'mouse', 'ab']);
    // throw Error('34343');
  }
}
