# tailwindcss 配置
## 1. 安装
1. `pnpm install -D tailwindcss postcss autoprefixer`
2. `npx tailwindcss init -p`  自动在项目添加 postcss.config.js 与 tailwind.config.js 配置文件，将 tailwindcss 引入项目
3. `tailwind.config.js` 下的 `content` 属性添加 `'./src/**/*.{vue,js,ts,jsx,tsx}'`
4. 在css入口文件引入 `tailwindcss` 的样式内容
   ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
   ```

## 2. vscode 配置
* 作用：
  1. 类名以及 CSS 函数和指令的智能建议
  2. 突出显示 CSS 和标记中的错误和潜在错误
  3. 将鼠标悬停在 Tailwind 类名称上可查看完整的 CSS
  4. 提供语法定义，以便正确突出显示 Tailwind 功能
  5. ......
* 安装：
  vscode 扩展中安装 `Tailwind CSS IntelliSense`

## 3. 文档地址
https://tailwindcss.com/docs/installation

## 4. 项目中可以进行配置,全局自定义clas类名等的地方
* `tailwind.config.js` tailwind全局配置项
* `/src/theme` 主题色配置的地方
* `src\assets\css\tailwindcss.css` 自定义工具类\class类\覆盖css默认配置等
* `src\assets\css\tailwindcss.js` 写插件,供tailwind.config.js消费的地方