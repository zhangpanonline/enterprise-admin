/** @type {import('tailwindcss').Config} */

// 生成颜色css变量名
function genSimilarColorsName(brandName) {
  const levels = [50, 100, 150, 200, 250, 300, 350, 400, 450, 'DEFAULT', 500, 550, 600, 650, 700, 750, 800, 850, 900, 950]
  return levels.reduce((acc, cur) => Object.assign(acc, { [cur]: `var(--${brandName}-color${cur === 'DEFAULT' ? '' : `-${cur}`})` }), {})
}

module.exports = {
  content: ['./src/**/*.{vue,js,jsx}'],
  theme: {
    extend: {
      spacing: {
        '4.5': '18px',
        '5': '20px',
        '8.5': '34px',
        '10.5': '42px',
        '12.5': '50px',
        '13': '52px',
        '13.5': '54px',
        '15': '60px',
        '17': '68px',
        '18': '72px',
        '19': '76px',
        '25': '100px',
        '26': '104px',
        '27.5': '110px',
        '29': '116px',
        '30': '120px',
        '50': '200px',
        '75': '300px',
        '100': '400px',
        '125': '500px',
      },
      lineHeight: {
        '12.5': '50px',
        '13': '52px',
        '13.5': '54px',
        '15': '60px',
        '17': '68px',
        '18': '72px',
        '19': '76px',
        '20': '80px',
        '25': '100px',
        '30': '120px',
        '50': '200px',
      },
      colors: {
        // 背景色
        undertone: '#F7FaFa',
        white: '#FFFFFF', // 前景色
        transparent: 'transparent',
        // 文字颜色
        black: genSimilarColorsName('black'),
        // 斑马格色 primary-50
        // 描边色 primary-350
        // 主色调 primary-550
        primary: genSimilarColorsName('primary'),
        // 边框颜色使用 info-50
        info: genSimilarColorsName('info'),
        success: genSimilarColorsName('success'),
        warning: genSimilarColorsName('warning'),
        danger: genSimilarColorsName('danger'),
      },
      screens: {
        // sm 用于适配移动端
        'sm': { 'max': '768px' },
        // 适配小屏笔记本
        'md': { 'min': '769px', 'max': '1399px' },
        // 适配大屏电脑
        'lg': { 'min': '1400px' },
        // 'sm': '640px',
        // 'md': '768px',
        // 'lg': '1024px',
        // 'xl': '1280px',
        '2xl': '1400px',
        '3xl': '1920px',
        '4xl': '2200px',
        '5xl': '2500px',
      },
    },
  },
  plugins: [
    require('./src/assets/css/tailwindcss.js'),
  ],
}
