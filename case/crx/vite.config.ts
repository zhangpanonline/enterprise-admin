import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import ElementPlus from 'unplugin-element-plus/vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import vitePluginStyleToVw from 'vite-plugin-style-to-vw'

export default defineConfig(({ mode }) => {
  // 加载当前模式下的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vitePluginStyleToVw({
        allReplace: false,
        unitToConvert: 'px',
        viewportWidth: 1920,
        unitPrecision: 6,
        viewportUnit: 'vw',
        fontViewportUnit: 'vw',
        minPixelValue: 1,
        attributeList: [],
      }),
      vue(),
      vueSetupExtend(),
      ElementPlus({
        useSource: true, // 使用 SCSS 源码
      }),
      crx({
        manifest,
      }),
      createHtmlPlugin({
        pages: [
          {
            entry: '/src/offscreen/offscreen.ts',
            filename: 'offscreen.html',
            template: 'src/offscreen/offscreen.html',
          },
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element_namespace.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        // 设置别名
        '@': resolve(__dirname, './src'), // 指向 src 目录
        '~': resolve(__dirname, './'), // 指向项目根目录
        // 可添加更多别名
        // 'utils': path.resolve(__dirname, './src/utils')
      },
      // 可选：省略文件扩展名
      extensions: ['.js', '.vue', '.json', '.ts'],
    },
    build: {
      sourcemap: env.VITE_APP_SOURCEMAP === 'true', // 是否开启 sourcemap
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_APP_DELETE_LOG === 'true', // 是否删除 console
          drop_debugger: env.VITE_APP_DELETE_LOG === 'true', // 是否删除 debugger
        },
        keep_fnames: env.VITE_APP_KEEP_FNAMES === 'true',
      },
      rollupOptions: {
        // input: {
        // options: resolve(__dirname, "src/options/main.ts"),
        //   // popup: resolve(__dirname, "src/popup/index.html"),
        //   // background: resolve(__dirname, "src/background.ts"),
        // offscreen: resolve(__dirname, 'src/offscreen/offscreen.html'),
        // },
        output: {
          // 在这里控制输出结构
          entryFileNames: 'libs/[name][hash].js',
          chunkFileNames: 'libs/[name][hash].js',
          assetFileNames: 'libs/[name][hash].[ext]',
        },
      },
      outDir: env.VITE_APP_OUT_DIR || 'dist',
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*', // 允许所有来源（开发环境）
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      port: 6123,
    },
  }
})
