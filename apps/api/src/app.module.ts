import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { GlobalModule } from './global/global.module';
import { ShareModule } from './share/share.module';
import { UserModule } from './user/user.module';
import { FuMiddleware1, FuMiddleware2 } from './logger/logger.middleware';
import { UserController } from './user/user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'

@Module({
  imports: [
    UserModule,
    OrderModule,
    GlobalModule,
    ShareModule,
    MulterModule.register({
      // 定义存储引擎
      storage: diskStorage({
        // 定义文件存储的目录
        destination: './uploads',
        // 创建随机文件名
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(
            null,
            `${file.originalname.split('.')[0]}_${randomName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'db1125',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FuMiddleware1, FuMiddleware2).forRoutes(UserController);
  }
}
