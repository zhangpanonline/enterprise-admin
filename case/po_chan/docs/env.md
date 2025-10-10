# [环境变量的配置](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)
1. 在项目根目录下创建`env`目录，用来保存所有的环境变量配置文件
2. `/env` 下分别创建 `.env.net` 、`.env.development` 和 `.env.production` 文件，分表表示测试、开发和生产环境下使用的环境变量
3. 环境变量文件里的变量有两种定义方式，一种以`VITE_`开头，另一种不是以`VITE_`开头的；只有已`VITE_`开头的才能在客户端源码中访问到，也就是说才能在浏览器环境中访问到，非`VITE_`开头的变量只能在`node`环境中访问
4. 以 `VITE_` 开头的变量在客户端源码的访问方式，例如`VITE_TEST=test`，访问方式：`import.meta.env.VITE_TEST`
5. 如果要更改环境变量默认（根目录）保存的文件夹地址，需要在`vite.config.js`中配置`envDir`，本项目使用的是`/env`目录
6. 如果要更改环境变量开头的关键字`VITE_`，需要在`vite.config.js`中配置`envPrefix`，可以配置多个关键字，默认即是`VITE_`
7. `vite`在`import.meta.env`上配置了一些所有环境下都能访问到的内置变量：
   * `import.meta.env.MODE`: {string} 应用运行的模式
   * `import.meta.env.BASE_URL`: {string} 部署应用时的基本 URL。他由base 配置项决定
   * `import.meta.env.PROD`: {boolean} 应用是否运行在生产环境（使用 NODE_ENV='production' 运行开发服务器或构建应用时使用 NODE_ENV='production' ）
   * `import.meta.env.DEV`: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)
   * `import.meta.env.SSR`: {boolean} 应用是否运行在 server 上