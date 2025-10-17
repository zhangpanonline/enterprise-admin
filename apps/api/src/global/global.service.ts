import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  getGlobal(): string {
    return '全局模块';
  }
}
