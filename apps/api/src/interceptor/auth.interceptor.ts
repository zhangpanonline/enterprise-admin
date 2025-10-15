import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, filter, toArray } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 在请求处理之前进行日志记录
    console.log('Request received...');
    return next.handle().pipe(
      // 使用 map 操作符将每个用户名转为大写
      map((name: string) => name.toUpperCase()),

      // 使用 filter 操作符过滤出名字长度大于2的用户
      filter((name: string) => name.length > 2),

      // 使用 tab 操作符进行简单的日志记录
      tap((arr) => console.log(`Filtered Name: ${arr}`)),

      // 转为数组
      toArray(),

      // 使用 catchError 操作符捕获并处理任何错误
      catchError((error) => {
        console.error('catchError：', error);
        // 返回新的 Observable
        return of('Fallback Value');
      }),
    );
  }
}
