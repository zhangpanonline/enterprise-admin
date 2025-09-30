import type { MainToOffscreenMessage, OffscreenToMainMessage } from '@/types'
import { requestDemandSupplyData, requestVolumeData } from './data'

// 获取今日成交量
const VOL_INTERVAL = 1000 * 60 * 1

class OffscreenController {
  private isRunning = false
  private timerId?: any
  private volTimerId?: any

  constructor() {
    this.setupMessageHandlers()
  }

  private setupMessageHandlers() {
    chrome.runtime.onMessage.addListener(
      async (request: MainToOffscreenMessage, _sender, sendResponse) => {
        switch (request.type) {
          case 'START_POLLING':
            if (this.isRunning) {
              sendResponse({ success: false, error: '轮询已在运行' })
              return
            }
            this.isRunning = true
            await this.startWorker()
            sendResponse({ success: true })
            break
          case 'STOP_POLLING':
            this.stopWorker()
            this.isRunning = false
            sendResponse({ success: true })
            break

          case 'STATUS_CHECK':
            this.sendToMain({
              type: 'STATUS',
              status: this.isRunning ? 'RUNNING' : 'STOPPED',
            })
            sendResponse({ success: true })
            break
        }
        return true

        // this.handleMessage(request)
        //   .then((result) => sendResponse(result))
        //   .catch((error) => {
        //     this.sendToMain({
        //       type: 'ERROR',
        //       error: error instanceof Error ? error.message : '未知错误',
        //     })
        //     sendResponse({ success: false, error })
        //   })
      }
    )
  }

  // private async handleMessage(
  //   request: MainToOffscreenMessage
  // ): Promise<{ success: boolean; error?: string }> {
  //   switch (request.type) {
  //     case 'START_POLLING':
  //       if (this.isRunning) {
  //         return { success: false, error: '轮询已在运行' }
  //       }

  //       await this.startWorker()
  //       this.isRunning = true
  //       return { success: true }

  //     case 'STOP_POLLING':
  //       this.stopWorker()
  //       this.isRunning = false
  //       return { success: true }

  //     case 'STATUS_CHECK':
  //       this.sendToMain({
  //         type: 'STATUS',
  //         status: this.isRunning ? 'RUNNING' : 'STOPPED',
  //       })
  //       return { success: true }
  //   }
  // }

  private async startWorker() {
    requestDemandSupplyData(this)
    // requestDemandSupplyData()
    // this.timerId = setInterval(() => {
    //   requestDemandSupplyData()
    // }, REQUEST_INTERVAL)

    requestVolumeData()
    this.volTimerId = setInterval(() => {
      requestVolumeData()
    }, VOL_INTERVAL)
  }

  private stopWorker() {
    console.log('停止运行')
    this.isRunning = false
    clearInterval(this.timerId)
    clearInterval(this.volTimerId)
  }

  private sendToMain(message: OffscreenToMainMessage) {
    chrome.runtime.sendMessage(message).catch((err) => {
      console.error('发送消息到主线程失败:', err)
    })
  }
}

// 初始化
new OffscreenController()
