import listenerWebRequest from  '@/packages/webRequest/service-worker'
import listenerOnMessage from './onMessage'
import { listenerLogin } from '@/content/service-worker'

if (import.meta.env.DEV) {
  setBadge({ text: 'OFF', color: '#FF0000' })
}
function setBadge({ text, color }: { text: 'ON' | 'OFF', color: string }): void {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  if (text === 'ON') {
    setTimeout(() => {
        setBadge({ text: 'OFF', color: '#FF0000' });
    }, 2000)
  } else {
    setTimeout(() => {
        setBadge({ text: 'ON', color: '#00FF00' });
    }, 2000)
  }
}

// 首次安装
chrome.runtime.onInstalled.addListener(() => {
  // 登录监听
  listenerLogin()
  listenerOnMessage()
  // 请求监控
  listenerWebRequest()
})

// 卸载
chrome.runtime.onSuspend.addListener(() => {

})