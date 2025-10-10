import { fileURLToPath } from 'node:url'
import {
  mergeConfig,
  defineConfig
  // configDefaults
} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // 指定测试环境 https://cn.vitest.dev/config/#environment
      environment: 'jsdom',

      // 匹配排除测试文件的 glob 规则 https://cn.vitest.dev/config/#exclude
      // 默认值：['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*']
      // exclude: [...configDefaults.exclude, 'e2e/*'],

      include: [
        // './src/components/*/*.spec.js',
        './src/hooks/*.spec.js',
      ],

      // 项目的根目录 https://cn.vitest.dev/config/#root
      root: fileURLToPath(new URL('./', import.meta.url)),

      // 处理依赖关系解析 https://cn.vitest.dev/config/#deps
      server: {
        // 对依赖关系进行内联或外联的处理 https://cn.vitest.dev/config/#server-deps
        deps: {
          // Vite 将处理内联模块 https://cn.vitest.dev/config/#server-deps-inline
          inline: ['element-plus'],
        },
      },
    },
  })
)
