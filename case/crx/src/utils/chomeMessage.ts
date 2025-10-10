import type { MessageResponse, SendMessageType } from '@/types'

/**
 * 向当前页面发送消息
 */
export function sendMessageToTab<T = any>(
  tabId: number,
  message: any
): Promise<MessageResponse<T>> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response: MessageResponse<T>) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }
    })
  })
}

export function sendMessage<T = any>(
  message: SendMessageType
): Promise<MessageResponse<T>> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response)
    })
  })
}
