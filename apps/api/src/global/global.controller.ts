import { Controller } from '@nestjs/common';
import { GlobalService } from './global.service';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}
}
