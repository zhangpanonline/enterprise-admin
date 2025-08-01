1. 请描述一下你在项目中如何做技术选型与目录结构设计？  
在我的项目中，我采用了 Vite + Vue3 + TypeScript + TailwindCSS 作为核心前端栈，这样可以保证开发效率、类型安全和可维护性。为了实现可扩展的架构，我选择了领域驱动结构（feature-based folder），将每个业务模块（如用户管理、权限管理）进行解耦，每个模块都有自己的组件、页面、service 等，利于后期多人协作和模块测试。同时，集成了 Supabase 提供的 Auth、数据库和 Storage 服务，简化后端接口开发，并使用 husky + commitlint 保证团队提交规范。

2. git提交规范  
在团队中我们采用了基于 Conventional Commits 的提交规范，配合 husky + commitlint 做了 Git 钩子校验，同时接入了 commitizen 提供交互式提交体验，确保所有人都能按照统一风格提交。这样我们可以基于提交记录自动生成 changelog，同时也方便代码回溯与版本管理。在 CI/CD 流程中我们还使用了 semantic-release，让构建、打包、发布、发版本号等完全自动化。