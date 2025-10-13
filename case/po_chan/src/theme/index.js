/**
 * 主题色相关
 */

import { merge } from 'lodash-es'
import { genMixColor } from './gen_color'

// 本地缓存 key
const THEME_KEY = 'BANKRUPTCY_THEME'

// 默认主题
export const defaultThemeConfig = {
  colors: {
    primary: '#255867', // 主题色 !!!不在这里配置，在updateBrandExtendColorsVar里根据UI提供的写死
    info: '#909399', // 边框等
    black: `#191919`, // 文字颜色
    warning: '#FF7D22', // 警告色
    danger: '#f56c6c', // 错误色
    success: '#67c23a', // 成功色
  },
}

// 设置css变量
function setStyleProperty(propName, value) {
  document.documentElement.style.setProperty(propName, value)
}

// 更新主题到css变量中
function updateThemeColorVar({ colors }) {
  // 遍历当前主题色，生成混合色，并更新到css变量（tailwind + elementPlus）
  for (const brand in colors) {
    updateBrandExtendColorsVar(
      colors[brand],
      brand
    )
  }

  function updateBrandExtendColorsVar(color, name) {
    let { DEFAULT, dark, light } = genMixColor(color)
    // 每种主题色由浅到深分为十九个阶梯以供开发者使用
    let levels = [
      { key: 50, value: light[9] },
      { key: 100, value: light[8] },
      { key: 150, value: light[7] },
      { key: 200, value: light[6] },
      { key: 250, value: light[5] },
      { key: 300, value: light[4] },
      { key: 350, value: light[3] },
      { key: 400, value: light[2] },
      { key: 450, value: light[1] },
      { key: 0, value: DEFAULT },
      { key: 500, value: DEFAULT },
      { key: 550, value: dark[1] },
      { key: 600, value: dark[2] },
      { key: 650, value: dark[3] },
      { key: 700, value: dark[4] },
      { key: 750, value: dark[5] },
      { key: 800, value: dark[6] },
      { key: 850, value: dark[7] },
      { key: 900, value: dark[8] },
      { key: 950, value: dark[9] },
    ]
    // 主色调使用UI提供的颜色
    if (name === 'primary') {
      DEFAULT = '#255867'
      light = ['', '#517985', '#668A95', '#70ABB9', '#92ACB3', '#A8BCC2', '#BECDD1', '#CFDADE', '#DEE6E8', '#F5F9FB']
      dark = ['#3B6976', '#255867', '#214F5D', '#1E4652', '#1A3E48', '#16353E', '#132C34', '#0F2329', '#0B1A1F', '#081317']
      levels = [
        // 斑马格颜色
        { key: 50, value: light[9] },
        // hover颜色
        { key: 100, value: light[8] },
        { key: 150, value: light[7] },
        { key: 200, value: light[6] },
        { key: 250, value: light[5] },
        { key: 300, value: light[4] },
        // 描边色
        { key: 350, value: light[3] },
        { key: 400, value: light[2] },
        { key: 450, value: light[1] },
        { key: 500, value: dark[0] },
        { key: 0, value: DEFAULT },
        // 主色调
        { key: 550, value: dark[1] },
        { key: 600, value: dark[2] },
        { key: 650, value: dark[3] },
        { key: 700, value: dark[4] },
        { key: 750, value: dark[5] },
        { key: 800, value: dark[6] },
        { key: 850, value: dark[7] },
        { key: 900, value: dark[8] },
        { key: 950, value: dark[9] },
      ]
    }
    levels.forEach(({ key, value }) => {
      if (key === 0) {
        setStyleProperty(`--${name}-color`, value)
      } else {
        setStyleProperty(`--${name}-color-${key}`, value)
      }
    })

    // elementPlus主题色更新
    setStyleProperty(`--el-color-${name}`, DEFAULT)
    setStyleProperty(`--el-color-${name}-dark-2`, dark[2])
    setStyleProperty(`--el-color-${name}-light-3`, light[3])
    setStyleProperty(`--el-color-${name}-light-5`, light[5])
    setStyleProperty(`--el-color-${name}-light-7`, light[6])
    setStyleProperty(`--el-color-${name}-light-8`, light[7])
    // hover颜色
    setStyleProperty(`--el-color-${name}-light-9`, light[8])
  }
}

// 获取本地缓存主题
export const getTheme = () => {
  const theme = localStorage.getItem(THEME_KEY)
  return theme ? JSON.parse(theme) : defaultThemeConfig
}

export const setTheme = (data = defaultThemeConfig) => {
  const oldTheme = getTheme()

  // 将传入配置与旧的主题合并，以填补缺省的值
  data = merge(oldTheme, data || {})

  // 将缓存到浏览器
  localStorage.setItem(THEME_KEY, JSON.stringify(data))

  // 将主题更新到css变量中，使之生效
  updateThemeColorVar(data)
}

