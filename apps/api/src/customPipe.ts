import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// 自定义ValidationPipe管道
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // value 是要处理的方法参数 metatype 是描述这个参数的元数据
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    // 如果是原生的 js 类型，则跳过验证
    if (!metatype || this.toValidate(metatype)) {
      return value;
    }

    // 将普通对象转类型对象才能验证
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = plainToInstance(metatype, value);
    // 调用验证方法
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
