# 图标库的引入
## 安装
1. 安装 `unplugin-icons` 和 `unplugin-vue-components`
2. 在 `vite.config.js` 里引入：
   ```js
    import IconsResolver from 'unplugin-icons/resolver'
    import Icons from 'unplugin-icons/vite'
    import Components from 'unplugin-vue-components/vite'
   ```
3. 在 `vite.config.js` 的 `plugins` 里添加如下代码：
   ```js
    Icons({
      // 自动安装
      autoInstall: true,
      // 缩放
      // scale: 1.2,
      // 默认类名
      // defaultClass: '',
      // 默认样式
      // defaultStyle: '',
      // 编译方式
      compiler: 'vue3',
    }),
   ```
4. 在 `vite.config.js` 的 `plugins` 里添加如下代码：
   ```js
     Components({
      ...
      resolvers: [
        ...
        // 自动注册图标组件
        IconsResolver({
          prefix: 'icon',
          // https://icones.netlify.app/
          // 可以指定使用哪些集合的图标，默认启用 Iconify 支持的所有集合['mdi']
          // enabledCollections: [],
        }),
      ],
    }),
   ```
## 文档地址
1. https://github.com/antfu/unplugin-icons
2. https://github.com/antfu/unplugin-vue-components

## 使用ElementPlus图标的方法
1. https://icones.netlify.app/
2. 搜索Element Plus
3. 选中一个图标，例如：house
4. 左下角会出现：ep:house
5. 在页面中使用 icon 前缀加 ep:House 的方式展示，例如：<IconEpHouse /> 或 <icon-ep-house />
6. 不只是ElementPlus里的，网站所有图标都可以使用，并且是按需自动导入、下载