### 项目目录结构

采用领域驱动（feature-based）目录结构

```shell
src/
├── app/                    # 应用入口配置区
│   ├── main.ts             # 应用主入口
│   ├── router/             # 路由系统
│   ├── store/              # Pinia 状态管理
│   ├── config/             # 通用配置（API 地址、环境等）
│   └── plugins/            # 插件注册区（Element Plus、i18n 等）

├── features/               # 🔥 核心功能模块（按业务领域组织）
│   ├── auth/               # 认证模块（登录注册权限）
│   ├── user/               # 用户管理
│   ├── dashboard/          # 仪表盘
│   └── ...                 # 其他功能模块

├── shared/                 # 跨功能共享资源
│   ├── components/         # 通用组件（按钮、弹窗等）
│   ├── hooks/              # 通用 hooks
│   ├── utils/              # 工具函数
│   ├── constants/          # 全局常量/枚举
│   └── types/              # 类型定义文件

├── assets/                 # 静态资源（图片/icon等）
├── styles/                 # Tailwind/全局样式文件
└── index.html              # 页面模板入口
```

### Q
<!-- TODO -->
1. 两种常见的代码结构组织方式有 `模块化（views/modules/xxx）`和 `领域驱动（features/ 风格）`，这两者有什么区别？