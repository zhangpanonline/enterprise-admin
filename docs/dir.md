### 项目目录结构

采用领域驱动（feature-based）目录结构

```shell
src/
├── features/               # 各业务领域模块
│   ├── auth/               # 登录/注册/权限相关
│   ├── dashboard/          # 仪表盘
│   ├── users/              # 用户管理
│   └── ...                 # 其他业务模块
├── shared/                 # 通用模块（组件、hooks、utils等）
│   ├── components/
│   ├── composables/
│   ├── stores/
│   ├── utils/
│   └── types/
├── app/                    # 应用级模块（入口、路由、状态）
│   ├── router/
│   ├── store/
│   └── config/
├── assets/                 # 静态资源
├── styles/                 # 全局样式
└── main.ts                 # 入口文件

```

### Q
<!-- TODO -->
1. 两种常见的代码结构组织方式有 `模块化（views/modules/xxx）`和 `领域驱动（features/ 风格）`，这两者有什么区别？