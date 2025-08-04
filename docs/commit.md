1. husky是什么？原理是什么？
    * 什么是 Husky？
        Husky 是一个用于管理 Git hooks 的工具，让你可以在特定 Git 操作（如 commit、push）时自动执行脚本操作，比如：

            * 提交前自动 eslint --fix

            * 提交信息格式校验（配合 commitlint）

            * push 前运行单元测试或构建检查

    * Git Hooks 是什么？  
        Git 本身提供了一组“钩子”机制，即你可以在某些操作发生前/后触发脚本：  
        | Git Hook     | 触发时机               | 常见用途                             |
        | ------------ | ------------------ | -------------------------------- |
        | `pre-commit` | 执行 `git commit` 之前 | 自动代码格式化、Lint 检查                  |
        | `commit-msg` | 提交信息写入后            | 校验提交信息格式（如 Conventional Commits） |
        | `pre-push`   | 执行 `git push` 前    | 执行测试或构建检查                        |
        | `post-push`  | 执行 `git push` 后    | 发送通知、部署应用等                        |
        Git 默认会在 .git/hooks 中放置这些钩子的示例文件（如 pre-commit.sample），但它默认不启用、也不便于团队协作。

    * Husky 的作用和优势  
        | 传统手动 Hook 设置          | Husky 提供的方式           |
        | --------------------- | --------------------- |
        | 手动编辑 `.git/hooks/xxx` | 在项目中集中管理 `.husky/xxx` |
        | 不易共享、无版本控制            | 脚本托管在项目，自动安装          |
        | 无执行权限、易失效             | 自动赋权，易于团队统一           |

    * Husky 的原理（深入理解）
        1.  安装时（执行 husky install）：  
            Husky 会在 .git/hooks/ 目录下创建一个软链接或脚本文件：
            ```bash
            .git/hooks/pre-commit
            ```
            其内容类似于：  
            ```bash
            #!/bin/sh
            . "$(dirname "$0")/../../.husky/_/husky.sh"
            exec <project-root>/.husky/pre-commit "$@"
            ```
            这段脚本的作用是：从 .git/hooks/ 间接调用 .husky/ 目录下你写的实际逻辑脚本。

        2. 当你执行 git commit：  
            * Git 触发 .git/hooks/pre-commit；

            * Husky 的 pre-commit 脚本执行（例如运行 npx lint-staged）；

            * 如果脚本返回非 0（出错），Git 提交会被中止。
    * Husky 的执行流程图
        ```text
        你执行 git commit
                │
                └───► .git/hooks/pre-commit
                            │
                            └───► .husky/pre-commit
                                        │
                                        └───► 执行脚本（lint、测试、检查等）

        ```
    * 常见应用场景举例  

    | 操作            | 配合工具                   | 说明                                       |
    | ------------- | ---------------------- | ---------------------------------------- |
    | 提交前运行 Lint    | `eslint`、`lint-staged` | 保证代码格式规范、自动修复问题                          |
    | 校验提交信息格式      | `commitlint`           | 遵循 Conventional Commits，便于自动生成 changelog |
    | push 前运行测试/构建 | `vitest`、`vue-tsc`     | 保证 push 的代码无语法或逻辑错误                      |


2. 使用 Commitizen + commitlint + husky + cz-conventional-changelog/cz-customizable 实现交互式提交 + 格式校验 + Git 提交钩子
    1. 安装依赖
        ```bash
        pnpm add -D commitizen cz-conventional-changelog commitlint @commitlint/cli husky
        ```
        在 `package.json` 中添加初始化命令：
        ```json
        "scripts": {
            "prepare": "pnpm install && pnpm exec husky init",
        }
        ```
    2. 初始化 husky + commitlint 校验钩子
        由于 Husky 9.x 移除了 add 命令，使用 **手动创建 Git hook 文件 + chmod +x** 的方式，因此我们需要手动添加钩子，
        在 `.husky` 目录下创建 `commit-msg` 文件，写入：
        ```sh
        #!/bin/sh
        . "$(dirname "$0")/_/husky.sh"

        npx --no -- commitlint --edit "$1"
        ```
        > 命令解释：  
        > `. "$(dirname "$0")/_/husky.sh"`：  
        > | 部分                           | 含义             |
        > | ---------------------------- | -------------- |
        > | `.`                          | 等价于source，在当前 Shell 环境中执行 *.sh 脚本里的命令（不会开启子进程） |
        > | `dirname "$0"`            | 当前脚本文件所在目录的路径       |
        > | `$(dirname "$0")`            | 输出：.husky       |
        > | `$(dirname "$0")/_/husky.sh` | 输出：.husky/_/husky.sh，这个 husky.sh 是 Husky 安装时自动创建的脚本模板，用于1. 初始化一些默认变量；2. 检查当前是否在 Git 仓库中；3. 提供一些通用的执行兼容逻辑。  |  
        >
        > 整体意思就是：引入 .husky/_/husky.sh 文件，让当前的 hook（如 pre-commit、commit-msg）在执行时具备 Husky 的执行环境和保护逻辑。
        >
        > `npx --no -- commitlint --edit "$1"`：
        > * npx：执行一个临时安装的 npm 包（这里是 commitlint）
        > * --no：这是 npx 的参数，意思是：不要自动安装缺失的包，只用本地项目里的。
        > * --：这是 参数分隔符，告诉 npx：“后面的参数不是给 npx 的，而是给它执行的那个命令（commitlint）的”。
        > * commitlint --edit $1：这是 commitlint 的实际命令，意思是：校验某个文件里的提交信息是否符合规范。$1 是 commitlint 的参数，表示要校验的文件路径，这个路径由 Git 传递给 commit-msg 钩子。
        >
        > 整体意思就是：执行 commitlint，校验某个文件里的提交信息是否符合规范。这个文件路径由 Git 传递给 commit-msg 钩子。

    3. 配置 commitlint（校验规则）
        新建文件 commitlint.config.ts：
        ```ts
        // commitlint.config.js
        module.exports = {
            extends: ['@commitlint/config-conventional']
        }
        ```  
    4. 设置 Commitizen 适配器
        ```jsonc
        // package.json
        {
        "config": {
            "commitizen": {
                "path": "cz-conventional-changelog"
                }
            }
        }
        ```
    5. 添加提交命令
        ```jsonc
        // package.json
        {
            "scripts": {
                "commit": "cz"
            }
        }
        ```
    6. 自定义交互式命令
       移除 `cz-conventional-changelog`，安装 `cz-customizable`：
       ```bash
       pnpm remove cz-conventional-changelog
       pnpm add -D cz-customizable
       ```
       修改 `package.json`：
       ```jsonc
       // package.json
       {
           "config": {
               "commitizen": {
                   "path": "cz-customizable"
               },
                "cz-customizable": {
                    "config": "./.cz-config.cjs"
                }
           }
        }
        ```
    7. 创建配置文件 .cz-config.cjs（项目根目录）
        ```js
        // .cz-config.cjs
        module.exports =  {
            types: [
                { value: 'feat',     name: 'feat:     ✨ 新功能' },
                { value: 'fix',      name: 'fix:      🐛 修复 bug' },
                { value: 'docs',     name: 'docs:     📝 文档变更' },
                { value: 'style',    name: 'style:    🎨 代码格式（不影响功能）' },
                { value: 'refactor', name: 'refactor: ♻️ 代码重构（无新增功能、无修复 bug）' },
                { value: 'perf',     name: 'perf:     ⚡ 性能优化' },
                { value: 'test',     name: 'test:     ✅ 添加测试' },
                { value: 'chore',    name: 'chore:    🔧 构建/工程配置变更' },
                { value: 'revert',   name: 'revert:   ⏪ 回退提交' },
                { value: 'ui',       name: 'ui:       💄 UI 样式调整（新增）' }, // 👈 自定义中文类型
            ],
            messages: {
                type: '选择你要提交的类型:',
                scope: '请输入修改范围（可选）:',
                customScope: '请输入自定义的 scope:',
                subject: '简要描述（建议不超过50字）:',
                body: '详细描述（可选）。使用 "|" 换行:',
                breaking: '列出任何 BREAKING CHANGES（可选）:',
                footer: '关联的 issue（如: #31, #34）（可选）:',
                confirmCommit: '确认提交？'
            },
            scopes: ['登录模块', '用户管理', '仪表盘', '权限系统'],
            allowCustomScopes: true,
            allowBreakingChanges: ['feat', 'fix'],
            subjectLimit: 100
        }
        ```
提交规范工具依赖作用对比表
| 包名 📦                                 | 作用简述                                               | 所在阶段                   | 备注说明                                                   |
| ------------------------------------- | -------------------------------------------------- | ---------------------- | ------------------------------------------------------ |
| **`@commitlint/cli`**                 | 提供 `commitlint` 的命令行工具，用于校验提交信息是否符合规范              | Git hook: `commit-msg` | 通常在 `.husky/commit-msg` 中调用：`npx commitlint --edit $1` |
| **`@commitlint/config-conventional`** | `commitlint` 的配置 preset，遵循 Conventional Commits 规范 | 配置文件中使用                | 必须配合 `commitlint.config.js` 中的 `extends` 一起使用          |
| **`commitlint`**                      | commitlint 核心模块，自动引入 CLI 与配置校验逻辑                   | 核心工具                   | 通常项目中只装 CLI 就够，`commitlint` 本体可以理解为 umbrella package   |
| **`husky`**                           | Git Hook 管理工具，用于在 commit/push 前自动执行脚本              | Git Hooks 阶段           | 会在 `.git/hooks` 中注册触发器，调用 `.husky/` 目录下脚本              |
| **`commitizen`**                      | 提供交互式命令行提交工具（`cz`），引导用户输入规范提交信息                    | 开发者手动执行                | 命令为 `npx cz` 或 `pnpm commit`，用于生成符合规范的 commit message  |
| **`cz-customizable`**                 | commitizen 的自定义配置适配器，可以自定义提交类型、提示内容                | 配合 commitizen 使用       | 在 `.cz-config.js` 中配置 `types`、`scopes`、`messages` 等    |


### INTERVIEW
1. 你在项目搭建中做了哪些？   
    我在项目中配置了 Git 提交规范系统，包括 Commitizen 的交互式提交工具，结合 cz-conventional-changelog 实现统一的提交风格，同时使用 commitlint + husky 配置 Git 钩子校验每次 commit 信息是否合规。这样我们整个团队的 Git 历史记录非常清晰，也可以结合 standard-version 或 semantic-release 实现 changelog 和自动版本发布。  
    我使用 cz-customizable 替代了默认的 cz-conventional-changelog，来自定义提交类型，使其更贴合我们业务领域，方便本地开发人员理解。例如我们加入了 ui 类型用于区分仅涉及视觉调整的提交，同时我们将交互语言配置为中文，提高团队一致性和提交规范的落地。


**参考文档**  
* [约定式提交 —— 一种用于给提交信息增加人机可读含义的规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83)  
* [husky](https://typicode.github.io/husky/zh/)