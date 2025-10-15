import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { log } from 'console';
import { Observable, tap, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('进入拦截器：', context.getClass());
    const now = Date.now();
    // 调用 handle
    return next.handle().pipe(
      tap(() => {
        // 统计耗时
        log('Timeout:', Date.now() - now);
      }),
      // 超时时间
      timeout(1000),
    );
  }
}
