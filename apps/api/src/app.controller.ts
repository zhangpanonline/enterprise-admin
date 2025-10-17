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
  ParseArrayPipe,
  // ValidationPipe,
  ParseFilePipe,
  Inject,
  Body,
  Post,
  UploadedFile,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { AppService } from './app.service';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { Observable, from } from 'rxjs';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';

enum StatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 上传单个文件
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(body, '<====== body');
    console.log(file, '<====== file');
    return {
      message: '上传成功',
      file,
    };
  }

  // 多文件上传 - 不区分文件名
  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files', 2)) // 限制文件数量
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log(body, '<====== body');
    console.log(files, '<====== files');
    return {
      message: '上传成功',
      files,
    };
  }

  // 多文件上传 - 区分文件名
  @Post('/uploads_')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files1', maxCount: 1 },
      { name: 'files2', maxCount: 1 },
    ]),
  ) // 限制文件数量
  uploadFiles_(
    @UploadedFiles()
    files: { files1: Express.Multer.File[]; files2: Express.Multer.File },
    @Body() body,
  ) {
    console.log(body, '<====== body');
    console.log(files, '<====== files');
    return {
      message: '上传成功',
      files,
    };
  }

  // 9. ParseFilePipe 管道
  // 上传任意文件
  @Post('/anyUploads')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: { files: 3 },
    }),
  )
  uploadAnyFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          //  文件大小限制
          new MaxFileSizeValidator({ maxSize: 1024 * 1000 }),
          // 文件类型限制
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body() body,
  ) {
    console.log(body, '<====== body');
    console.log(files, '<====== files');
    return {
      files,
    };
  }

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

  // 7. ParseArrayPipe 管道
  @Get('pipe/array')
  getPieArray(
    @Query(
      'ids',
      new ParseArrayPipe({
        separator: ',',
      }),
    )
    ids: number[],
  ): number[] {
    // http://localhost/pipe/array?ids=1,2,3
    return ids;
  }

  // 8. ValidationPipe 管道
  @Inject(UserService) private userService: UserService;
  @Post('pipe/create')
  createUser(
    // @Body(ValidationPipe) createUserDto: CreateUserDto,
    // 由于在 main.ts 进行了全局管道验证器绑定，所以这里不需要绑定了
    @Body() createUserDto: CreateUserDto,
  ): CreateUserDto {
    return this.userService.create(createUserDto);
  }
}
