/**
 * @Author: zhangrui zhangrui@glhz.team
 * @Date: 2025-07-01 16:29:39
 * @Description: 获取交易中心的token 和 所有Cookie
 */
import type { TokenCookieType } from '@/types'
import Cookies from 'js-cookie'

export function getTokenCookieData(): TokenCookieType {
  return {
    token: getToken(),
    UKeyInfo: getUKeyInfo(),
  }
}

/**
 * 获取Token
 * @returns
 */
export function getToken(): string {
  return sessionStorage.getItem('token') || ''
}

export function getUKeyInfo(): string {
  return sessionStorage.getItem('UKeyInfo') || ''
}

/**
 * 获取所有Token
 * @returns
 */
export function getAllCookie(): string {
  return JSON.stringify(Cookies.get())
}
