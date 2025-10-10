import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Inspect from 'vite-plugin-inspect'
import SvgIcons from './src/plugins/vite/SvgIcons'
// import glob from 'glob'
// https://vitejs.dev/config/
export default defineConfig({
  envDir: 'env', // 环境变量文件的存储位置
  base: '/bankrupt/', // 公共基础路径
  server: {
    host: true,
    port: 8888,

  },
  preview: {
    port: 9999,
  },
  plugins: [
    /**
     * 对指定目录下的svg文件进行处理,加载到body下
     * iconDirs: 要递归处理的目录
     * prefix: 前缀,默认为空
     *
     * 使用方法
     * <svg color="green" >
     *  <use href="# + 前缀 + svg名称"/>
     * </svg>
     *
     * 已在 /src/components/IconSvg.vue进行封装,
     * 在vue文件中直接使用 <IconSvg size="100" color="green" name="qianzhui + svg名称" /> 进行应用
     */
    SvgIcons({
      iconDirs: [fileURLToPath(new URL('./src/assets/images', import.meta.url))],
    }),
    // 用于vite插件调试
    Inspect(),
    // https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue
    vue(),
    // https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx
    vueJsx(),
    // https://github.com/antfu/unplugin-auto-import
    // 自动帮我们引入声明的函数, 并自动生成 ts 类型声明文件。不用我们再手动引入函数
    AutoImport({
      include: [
        /\.[j]sx?$/, /\.vue\??/,
      ],
      dts: false, // 取消生成导入函数的 *.d.ts 文件
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            // https://vueuse.org/shared/useDateFormat/#usedateformat
            'useDateFormat',
          ],
        },
      ],
      eslintrc: {
        enabled: true, // 生成 .eslintrc-auto-import， 在 .eslintrc.cjs 里引入
      },
      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
      ],
      dirs: [
        './src/api',
        './src/stores',
        './src/hooks',
        './src/constant',
      ],
    }),
    /**
     * https://github.com/antfu/unplugin-vue-components
     * 自动帮我们引入全局组件，不用手动引入。并生成 ts 类型声明文件
     * 默认情况下，此插件将导入 src/components 路径中的组件,可以使用 dirs 选项自定义它
     */
    Components({
      deep: false,
      dts: true, // 取消生成导入组件的 *.d.ts 文件
      // 指定后，“dirs”和“extensions”选项将被忽略
      // globs: [
      //   ...glob.sync('./src/components/*/*.vue').map(file => {
      //     const basename = file.match(/\/([^\/]+)\.vue$/)[1]
      //     return `./src/components/${basename}/${basename}.vue`
      //   }),
      // ],
      globs: [
        './src/components/Form/Form.vue',
        './src/components/FormatCNY/FormatCNY.vue',
        './src/components/HuaweiObsUpload/HuaweiObsUpload.vue',
        './src/components/IconSvg/IconSvg.vue',
        './src/components/Look/Look.vue',
        './src/components/Table/Table.vue',
        './src/components/WangEditor/WangEditor.vue',
      ],
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          prefix: 'icon',
          // https://icones.netlify.app/
          // 可以指定使用哪些集合的图标，默认启用 Iconify 支持的所有集合
          // enabledCollections: [],
        }),
      ],
    }),
    // https://github.com/antfu/unplugin-icons
    Icons({
      // 自动安装
      autoInstall: true,
      // 缩放
      // scale: 1.2,
      // 默认类名
      // defaultClass: '',
      // 默认样式
      defaultStyle: '',
      // 编译方式
      compiler: 'vue3',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
