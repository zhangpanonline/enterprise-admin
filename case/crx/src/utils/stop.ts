import { SYSTEM_EL_ID } from '@/constants'
import { useSystemStore } from '@/store'
import { ActionType } from '@/types/enum'
/**
 * 页面停止
 */
export function stopRun() {
  sendMessageToContentScriptByClose()
  // removeContainer()
}
/**
 * 插件后台管理 停止运行
 */
export function sendMessageToContentScriptByClose() {
  const systemStore = useSystemStore()
  chrome.runtime.sendMessage({
    type: ActionType.STOP_POPUP,
    data: {
      tabId: systemStore.tabId,
    },
  })
}

/**
 * 关闭后 删除容器
 */
export function removeContainer() {
  const element = document.getElementById(SYSTEM_EL_ID)
  if (element) {
    element.remove()
  }
}

export function sendMessageToContentScriptByMinimize() {
  const systemStore = useSystemStore()
  chrome.runtime.sendMessage({
    type: ActionType.CLOSE_POPUP,
    data: {
      tabId: systemStore.tabId,
    },
  })
}
