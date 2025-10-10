/**
 * 为了适配不同分辨率的显示，改插件按照比例转换 高度 或者 宽度 的数字
 */

import { isNumber, isString } from 'lodash-es'
// 设计稿的宽度
const baseWidth = 1920
// 设计稿的高度
const baseHeight = 1080

/**
 * 用户适配宽度
 * @param num
 * @returns
 */
export function $adapter_width(num: any) {
  if (!num) return num
  return computeValueNotUnit(num, baseWidth, getWindowWidth())
}

export function $adapter_width_unit(num: any) {
  if (!num) return num
  return computeValue(num, getWindowWidth()) + 'vw'
}

/**
 * 用户适配宽度
 * @param num
 * @returns
 */
export function $adapter_height(num: any) {
  if (!num) return num
  return computeValueNotUnit(num, baseHeight, getWindowHeight())
}

export function $adapter_height_unit(num: any) {
  if (!num) return num
  return computeValue(num, getWindowHeight()) + 'vh'
}

/**
 * 获取宽度
 * @returns
 */
function getWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  )
}

/**
 * 获取高度
 * @returns
 */

function getWindowHeight() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  )
}

/**
 * 计算
 */
function computeValue(val: number, innerWidth: number) {
  if (!val) return val

  let _val = 0
  if (isNumber(val)) {
    _val = val
  }
  if (isString(val)) {
    _val = Number(val)
  }

  if (!!_val) return pxToVwOrVh(_val, estimateZoomLevel(), innerWidth)
  return val
}

// 将px转换为vw，考虑到缩放比例
function pxToVwOrVh(px: number, _zoomLevel: number, _innerWidth: number) {
  // 使用 window.innerWidth 作为当前视口宽度，考虑缩放
  // const viewportWidth = innerWidth * zoomLevel
  const viewportWidth = baseWidth

  // 计算给定px值对应的vw值
  const vw = (px / viewportWidth) * 100
  return vw.toFixed(8)
}

// 获取当前的缩放比例（基于devicePixelRatio和screen vs window尺寸）
function estimateZoomLevel() {
  // devicePixelRatio 表示物理像素与CSS像素的比例
  const dpr = window.devicePixelRatio

  return dpr || 1
}

/**
 * 计算
 */
function computeValueNotUnit(
  val: number,
  baseValue: number,
  currentValue: number
) {
  if (!val) return val

  let _val = 0
  if (isNumber(val)) {
    _val = val
  }
  if (isString(val)) {
    _val = Number(val)
  }

  if (!!_val) return parseFloat(((currentValue / baseValue) * _val).toFixed(8))
  return val
}
