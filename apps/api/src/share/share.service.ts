import { Injectable } from '@nestjs/common';

@Injectable()
export class ShareService {
  getShare() {
    return '共享模块';
  }
}
