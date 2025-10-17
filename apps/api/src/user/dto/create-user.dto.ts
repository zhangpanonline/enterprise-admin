import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt({ message: 'age 字段必须是数字类型' })
  age: number;

  @IsString({ message: 'sex 必须是字符串类型' })
  sex: string;

  phone: string;

  email: string;
}
