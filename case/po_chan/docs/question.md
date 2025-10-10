# 遇到的问题

1. 问题描述：
   `Cannot find module 'vue-router'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?ts(2792)`

   解决方法：
   在 `/tsconfig.app.json` 文件下的 `compilerOptions` 对象里，添加 `"moduleResolution": "node"`

   参考链接：[Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

2. 问题描述：
   在 `/playwright.config.ts` 文件，es-lint 报错 `process` 为定义。

   解决方法：
   在 `/.eslintrc.cjs` 添加如下配置：
   ```json
    env: {
      'node': true,
      'commonjs': true,
    },
   ```

3. 问题描述：
   `Property 'env' does not exist on type 'ImportMeta'`

   所在目录：
   `src\router\index.ts`

   解决方法：
   在 `/tsconfig.app.json` 文件下的 `compilerOptions` 对象里，添加
   `"types": [ "vite/client" ]`