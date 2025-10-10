# GIT提交规范

## [参考链接](https://juejin.cn/post/6982192362583752741)

## 1. 使用commitizen规范commit提交格式

commitizen 的作用主要是为了生成标准化的 commit message，符合 Angular 规范。
如果需要在项目中使用 commitizen 生成符合 AngularJS 规范的提交说明，还需要安装 cz-conventional-changelog 适配器：

```bash
pnpm install -D commitizen cz-conventional-changelog
```

工程根目录下增加 `.czrc` 文件：

```js
{
  "path": "cz-conventional-changelog"
}
```

提交代码时，使用 `pnpm cz` 代替 `git commit`

## 2. 代码提交规范检查

安装 commitlint 和 husky：

```bash
pnpm install -D @commitlint/cli @commitlint/config-conventional husky
```

在package.json 添加如下脚本：

```js
"scripts": {
  "postinstall": "husky install"
}
```

该脚本会在执行完 $ pnpm install 之后自动执行，进行 husky 的初始化，执行完毕后就会在根目录下创建一个 .husky 目录。
执行如下命令新增一个husky的hook：

```bash
pnpm install
```

## 3. 代码规范检查

首选需要安装 eslint 和 lint-stage

```bash
pnpm install -D eslint lint-staged
```

在根成根目录下添加 `.eslintrc.js` 配置文件
lint-staged 是 Git 里的概念，表示暂存区，lint-staged 表示只检查暂存区中的文件。
package.json 中增加如下配置:

```json
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
}
```
根目录创建 `commitlint.config.js` 文件：
```js
module.exports = {
  extends: [
    "@commitlint/config-conventional"
  ],
  // 以下时我们自定义的规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'feat', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        'merge' // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
      ]
    ]
  }
};
```
执行yarn husky add .husky/commit-msg 'yarn commitlint --edit "$1"'，会看到在根目录的.husky文件夹下多了一个 commit-msg 文件


## 4. 提交时代码类型说明
build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
docs：文档更新
feat：新增功能
fix：bug 修复
perf：性能优化
refactor：重构代码(既没有新增功能，也没有修复 bug)
style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
test：新增测试用例或是更新现有测试
revert：回滚某个更早之前的提交
chore：不属于以上类型的其他类型(日常事务)