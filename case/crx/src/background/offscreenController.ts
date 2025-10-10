import type { MainToOffscreenMessage } from '@/types'
import { getFileUrl } from '@/utils/fileUrl'

class BackgroundController {
  private isPolling = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    await this.ensureOffscreenDocument()
    // this.setupMessageHandlers()

    // 扩展启动时自动开始轮询
    // chrome.runtime.onStartup.addListener(() => this.startPolling())
    // chrome.runtime.onInstalled.addListener(() => this.startPolling())
  }

  private async ensureOffscreenDocument(): Promise<void> {
    const offscreenUrl = getFileUrl('offscreen.html')

    const contexts = await chrome.runtime.getContexts({
      documentUrls: [offscreenUrl],
    })

    if (contexts && contexts.length > 0) return

    try {
      await chrome.offscreen.createDocument({
        url: offscreenUrl,
        reasons: ['GEOLOCATION'],
        justification: '需要请求数据',
      })
    } catch (error) {
      console.error('创建 Offscreen Document 失败:', error)
      throw error
    }
  }

  // private setupMessageHandlers() {
  //   chrome.runtime.onMessage.addListener(
  //     (message: OffscreenToMainMessage, _sender, _sendResponse) => {
  //       this.handleOffscreenMessage(message)
  //     }
  //   )
  // }

  // private handleOffscreenMessage(message: OffscreenToMainMessage) {
  //   switch (message.type) {
  //     case 'POLLING_DATA':
  //       this.processPollingData(message.data)
  //       break
  //     case 'STATUS':
  //       console.log(`轮询状态: ${message.status}`)
  //       break
  //     case 'ERROR':
  //       console.error('轮询错误:', message.error)
  //       break
  //   }
  // }

  // private processPollingData(data: unknown) {
  //   // 存储数据到本地
  //   chrome.storage.local.set({ lastPollData: data })
  //   // 可以发送到内容脚本或其他地方
  //   chrome.runtime
  //     .sendMessage({
  //       type: 'NEW_DATA_AVAILABLE',
  //       data,
  //     })
  //     .catch((err) => console.error('发送数据失败:', err))
  // }

  public async startPolling() {
    if (this.isPolling) return

    const message: MainToOffscreenMessage = {
      type: 'START_POLLING',
    }

    try {
      await chrome.runtime.sendMessage(message)
      this.isPolling = true
      console.log('轮询已启动')
    } catch (error) {
      console.error('启动轮询失败:', error)
    }
  }

  public async stopPolling() {
    if (!this.isPolling) return

    const message: MainToOffscreenMessage = { type: 'STOP_POLLING' }

    try {
      await chrome.runtime.sendMessage(message)
      this.isPolling = false
      console.log('轮询已停止')
    } catch (error) {
      console.error('停止轮询失败:', error)
    }
  }
}

// 初始化
const controller = new BackgroundController()

export default controller
