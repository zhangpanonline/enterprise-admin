import { Injectable, Inject } from '@nestjs/common';
import { GlobalService } from 'src/global/global.service';
import { ShareService } from 'src/share/share.service';

@Injectable()
export class OrderService {
  // 使用构造函数注入
  // constructor(private shareService: ShareService) {}

  // 依赖注入之属性注入共享的服务
  @Inject(ShareService) private shareService: ShareService;
  @Inject(GlobalService) private globalService: GlobalService;

  getShare(): string {
    return this.shareService.getShare();
  }
  getGlobal(): string {
    return this.globalService.getGlobal();
  }
}
