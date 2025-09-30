export default {
  plugins: {
    'postcss-import': {}, // 处理 @import
    autoprefixer: {}, // 自动添加浏览器前缀
    'postcss-preset-env': {
      // 使用现代 CSS 特性
      stage: 3,
      features: {
        'nesting-rules': true, // 启用 CSS 嵌套
        'custom-media-queries': true, // 支持自定义媒体查询
      },
    },
    // 响应性处理 把px -> vw
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 1920, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: [], // 指定不转换为视窗单位的类名，
      minPixelValue: 0, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    },
  },
}
