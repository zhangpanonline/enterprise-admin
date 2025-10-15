import {
  Controller,
  Get,
  Query,
  Param,
  UseInterceptors,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  ParseFloatPipe,
  ParseBoolPipe,
  ParseUUIDPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { Observable, from } from 'rxjs';

enum StatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

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

  // 1. ParseIntPipe 管道
  @Get('pipe/int/:id')
  getPipeInt(
    @Param(
      'id',
      new ParseIntPipe({
        // 可以自定义校验失败时的状态码
        // errorHttpStatusCode: 400,
        // 可以自定义校验失败的错误提示
        exceptionFactory(error) {
          // 抛出HTTP异常
          throw new HttpException(
            '参数id类型错误：' + error,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    id: number,
  ): number {
    // http://localhost/pipe/int/123
    console.log('int id: ', id);
    return id;
  }

  // 2. ParseFloatPipe 管道
  @Get('pipe/float/:id')
  getPipeFloat(@Param('id', ParseFloatPipe) id: number): number {
    // http://localhost/pipe/int/123.232
    console.log('float id：', id);
    return id;
  }

  // 3. ParseBoolPipe 管道
  @Get('pipe/bool')
  getPipeBool(@Query('bool', ParseBoolPipe) flag: boolean): boolean {
    // http://localhost/pipe/bool?bool=false
    console.log('bool flag：', flag);
    return flag;
  }

  // 4. ParseUUIDPipe 管道
  @Get('pipe/uuid')
  getPipeUui(@Query('id', ParseUUIDPipe) id: string): string {
    // http://localhost/pipe/uuid?id=0db585fe-fba7-4b61-aa17-b887803364bd
    console.log('uuid id：', id);
    return id;
  }

  // 5. ParseEnumPipe 管道
  @Get('pipe/enum')
  getPipeEnum(
    @Query('status', new ParseEnumPipe(StatusEnum)) status: StatusEnum,
  ): StatusEnum {
    // http://localhost/pipe/enum?status=success
    console.log('enum status：', status);
    return status;
  }

  // 6. DefaultValuePipe 管道
  @Get('pipe/default')
  getPipeDefault(
    @Query('value', new DefaultValuePipe('设置一个默认值')) value: string,
  ): string {
    // http://localhost/pipe/default
    console.log('defaultValue value：', value);
    return value;
  }
}
