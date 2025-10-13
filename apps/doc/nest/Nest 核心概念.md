---
sidebar_position: 1
---

## 1. Nest 中的装饰器
### 类装饰器
* `@Controller`：用于装饰控制器类，使之能够管理应用中的路由程序，并通过设置路由路径前缀来模块化管理路由。
* `@Injectable`：装饰后成为服务提供者，可以被其他对象进行依赖注入。
* `@Module`：模块装饰器，用于在 `Nest` 中划分功能模块并限制依赖注入的范围。
* `@UseInterceptors`：用于绑定拦截器，将拦截器的作用范围限制在控制器类范围中（当然也可以作用在类的方法上）。

### 方法装饰器

* `@Get/@Post`：用于定义路由方法的 `HTTP` 请求方式。

### 属性装饰器

* `@IsNotEmpty/@IsString/@IsNumber`：用于在参数的验证场景中校验 `HTTP` 请求的参数是否符合预期。

### 参数装饰器

* `@Body/@Param/@Query`：用于接收 `HTTP` 请求发送的数据，不同的请求方式对应不同的参数接收方式。

## 2. 模块化

模块通过 `@Module` 装饰器来声明。每个应用都会有一个根模块，`Nest` 框架会从根模块开始收集各个模块之间的依赖关系，形式依赖关系树。

### 共享模块

使用`nest g resource User --no-spec` 和 `nest g resource Order --no-spec` 命令分别生成 `User` 和 `Order` 模块。

如果 `Order` 模块需要依赖 `User` 模块中的 `UserService`，这时可以将 `UserService` 添加到 `UserModule` 的 `exports` 中，使之成为共享服务。

1. 在 `User` 模块中导出 `User` 服务：

   ```typescript
   // user.module.ts
   import { Module } from '@nestjs/common';
   import { UserService } from './user.service';
   import { UserController } from './user.controller';
   
   @Module({
     controllers: [UserController],
     providers: [UserService],
     exports: [UserService], // 导出UserService，使其可以在其他模块中使用
   })
   export class UserModule {}
   ```

2. 在 `Order` 模块中导入 `User` 模块

   ```ts
   // order.module.ts
   import { Module } from '@nestjs/common';
   import { OrderService } from './order.service';
   import { OrderController } from './order.controller';
   import { UserModule } from 'src/user/user.module';
   
   @Module({
     imports: [UserModule],
     controllers: [OrderController],
     providers: [OrderService],
   })
   export class OrderModule {}
   ```

3. 在 `order.service.ts` 中通过属性注入 `UserServcie` 依赖

   ```typescript
   // order.service.ts
   import { Injectable, Inject } from '@nestjs/common';
   import { UserService } from 'src/user/user.service';
   
   @Injectable()
   export class OrderService {
     // 依赖注入之属性注入共享的服务
     @Inject(UserService) private userService: UserService;
   
     getOrderDesc(): string {
       // 使用 this.userService
     }
   }
   ```

   > 在 `order.service.ts` 中除了通过 `@Inject` 注入的方式，还可以通过构造函数：
   >
   > ```   typescript
   > constructor(private userService: UserService) {}
   > ```
   >
   > 或实例化 `UserService` 类：
   >
   > ```typescript
   > private userService: UserService = new UserService()
   > ```
   >
   > 来使用 `this.userService`。