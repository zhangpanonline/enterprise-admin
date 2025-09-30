import type { MessageResponse, SendMessageType, TokenCookieType } from '@/types'
import { ActionType, ControlPollingEnum, MessageType } from '@/types/enum'
import {
  getCurrentStartType,
  getIsLoadData,
  getMinimizeTabIdList,
  getToken,
  removeCurrentTabIdList,
  removeMinimizeTabIdList,
  setCurrentTabIdList,
  setIsLoadData,
  setToken,
  setUKeyInfo,
  getCurrentTabIdList,
} from '@/utils/chomeStorage'
import { sendMessageToTab } from '@/utils/chomeMessage'
import {
  getInitData,
  startPollingDeclarationData,
  stopPollingDeclarationData,
  getTableData,
  getTableFormData,
  saveTableData,
  saveTableDataByKey,
  getCurrentTabDemandSupplyData,
  handleStartType,
  handleStopType,
  handleGoToDeclare,
  handleBatchFilling,
  getAllTransactionTypes,
  sendMessageToTabByGetTableList,
} from './data'
import {
  getCompatibleTabs,
  handleMinimize,
  handleStopRun,
  handleTokenExpiration,
  initClearData,
  removeTabId,
} from './clearData'
import { getHostPermissions } from '@/utils/app'

/**
 * 监听用户点击插件的图标 启动插件
 */
chrome.action.onClicked.addListener(async (tab) => {
  // 如果是非交易地址 点击插件 不做任何响应
  const hostPermissions = getHostPermissions()
  for (let h = 0; h < hostPermissions.length; h++) {
    const url = hostPermissions[h]
    if (!tab.url?.startsWith(url)) {
      return
    }
  }

  if (!tab) return

  const isLoadData = await getIsLoadData()
  const token = await getToken()
  if (isLoadData && token) {
    const list = await getMinimizeTabIdList()
    if (list.includes(tab.id!)) {
      // 如果是之前最小化的窗口，则恢复
      sendMessageToTab(tab.id!, {
        action: ActionType.RESTORE_POPUP,
        data: {},
      })
      removeMinimizeTabIdList(tab.id!)
      setCurrentTabIdList(tab.id!)
      return
    }
  }

  // 通知页面加载js并开始弹框
  sendMessageToTab<unknown>(tab.id!, {
    action: ActionType.SHOW_POPUP,
  })
    .then((res) => {
      if (res.success) {
        const data = res.data as TokenCookieType
        // 存储token
        setToken(data.token)
        setUKeyInfo(data.UKeyInfo)
        // 开始加载初始数据
        getInitData(tab)
      }
    })
    .catch((err) => {
      setIsLoadData(false)
      removeCurrentTabIdList(tab.id!)
      console.log(err)
    })
})

chrome.runtime.onMessage.addListener(
  (
    request: SendMessageType,
    _sender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    switch (request.type) {
      case MessageType.DEMAND_SUPPLY_REQUEST_SUCCESS:
        // 需求供应请求成功
        // const tabs = await getTabs()
        getCompatibleTabs().then((ids) => {
          ids.forEach((id) => {
            getCurrentTabDemandSupplyData(id).then((res) => {
              sendMessageToTab<unknown>(id!, {
                action: ActionType.UPDATE_DEMAND_SUPPLY,
                data: res,
              }).catch(() => {})
            })
          })
        })

        sendResponse({
          success: true,
          data: null,
          message: 'ok',
        })
        break
      case MessageType.UPDATE_TYPE_DATA:
        getCompatibleTabs().then((ids) => {
          ids.forEach((id) => {
            getAllTransactionTypes().then((types) => {
              sendMessageToTab<unknown>(id!, {
                action: ActionType.REFRESH_TYPE_DATA,
                data: {
                  types,
                },
              }).catch(() => {})
            })
          })
        })
        break
      case ActionType.CONTROL_POLLING:
        switch (request.action) {
          case ControlPollingEnum.start:
            startPollingDeclarationData()
            sendResponse({ success: true })
            break
          case ControlPollingEnum.stop:
            stopPollingDeclarationData()
            sendResponse({ success: true })
            break
        }
        break
      case ActionType.GET_TABLE_DATA:
        // 根据表名 获取数据
        getTableData(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.GET_TABLE_FORM_DATA:
        // 获取当前类型的表单数据 以及表格数据
        getTableFormData(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.SAVE_TABLE_FORM_DATA:
        saveTableData(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.SAVE_TABLE_DATA_BY_KEY:
        saveTableDataByKey(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      // case ActionType.SAVE_TABLE_DATA_BY_KEY:
      //   saveTableDataByKey(request)
      //     .then((data) => {
      //       sendResponse({ success: true, data: data })
      //     })
      //     .catch((error) => {
      //       sendResponse({ success: false, data: null, message: error })
      //     })
      //   break
      case ActionType.GET_START_TYPES:
        getCurrentStartType()
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.START_TYPE:
        handleStartType(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.STOP_TYPE:
        handleStopType(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case MessageType.GO_TO_DECLARE:
        // 需要申报的
        handleGoToDeclare(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.TOKEN_EXPIRATION:
        // token过期
        handleTokenExpiration(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.STOP_POPUP:
        //  停止运行
        handleStopRun(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.CLOSE_POPUP:
        handleMinimize(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.BATCH_FILLING:
        handleBatchFilling(request)
          .then((data) => {
            sendResponse({ success: true, data: data })
          })
          .catch((error) => {
            sendResponse({ success: false, data: null, message: error })
          })
        break
      case ActionType.UPDATE_TABLE_DATA:
        sendMessageToTabByGetTableList()
        sendResponse({ success: true, data: {} })
        break
      case ActionType.OFF_SCREEN_REQUEST_PROXY:
        (async () => {
          const tabIds = await getCurrentTabIdList()
          sendResponse(await sendMessageToTab(tabIds[0], request.data))
        })();
        break
    }
    return true
  }
)

/**
 * 浏览器关闭
 */
// chrome.windows.onRemoved.addListener(() => {
// initClearData()
// })

// 监听tab关闭事件
chrome.tabs.onRemoved.addListener(async (tabId) => {
  /**
   * 监听tabId 关闭 删除与 tabId 有关的数据
   */
  // deleteDataByTabId(tabId)
  await removeTabId(tabId)
})
/**
 * 监听安装
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension onInstalled')
  initClearData()
})

/**
 * 监听启动
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension onStartup')
  // initClearData()
})

// chrome.runtime.onSuspend.addListener(() => {
//   console.log('Extension onSuspend')
//   // initClearData()
// })
