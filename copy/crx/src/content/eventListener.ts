import http from '@/utils/request'
import { useSystemStore, useDataStore } from '@/store'
import type { MessageResponse, TabMessage } from '@/types'
import { ActionType } from '@/types/enum'
import {
  getToken,
  getTokenCookieData,
  getUKeyInfo,
} from '@/utils/getTokenByContent'
import { messageBox } from '@/utils/message'
import { stopRun } from '@/utils/stop'
// 是否显示token过期提示
let isShowTokenExpiration = false

/**
 * 监听来自content-script的消息
 */
export function initListeners() {
  chrome.runtime.onMessage.addListener(
    (
      message: TabMessage,
      _sender,
      sendResponse: (response: MessageResponse) => void
    ) => {
      const dataStore = useDataStore()
      const systemStore = useSystemStore()
      switch (message.action) {
        case ActionType.SHOW_POPUP:
          const isCheckUkey = import.meta.env.VITE_APP_IS_CHECK_UKEY === 'true'
          const isCheckToken =
            import.meta.env.VITE_APP_IS_CHECK_TOKEN === 'true'
          const token = getToken()
          const UKeyInfo = getUKeyInfo()
          systemStore.clearUpdateList()
          if (isCheckToken && !token) {
            messageBox('温馨提示', '请先登录交易平台', 'warning')
            sendResponse({
              success: false,
            })
            return
          }

          if (isCheckUkey && !UKeyInfo) {
            messageBox('温馨提示', '请先插入UKey', 'warning')
            sendResponse({
              success: false,
            })
            return
          }
          const tokenCookie = getTokenCookieData()
          // 系统激活
          systemStore.setActivate(true)
          systemStore.setLoading(true)
          sendResponse({
            success: true,
            data: tokenCookie,
          })
          break
        case ActionType.CLOSE_POPUP:
          // 系统弹窗关闭
          systemStore.setActivate(false)
          sendResponse({
            success: true,
          })
          break
        case ActionType.INIT_DATA_REQUEST_SUCCESS:
          // 数据初始化完成 页面开始渲染数据
          systemStore.setLoading(false)

          dataStore.setTypeList(message.data.typeList)
          // dataStore.setHistoryList(message.data.historyList)
          dataStore.setCurrentDate(message.data.currentDate)
          dataStore.setCurrentType(message.data.currentType)
          dataStore.setTradingUnitData(message.data.tradingUnitData)
          // dataStore.setEnergyRatesHourlyList(message.data.demandSupplyBalance)
          // dataStore.setDemandSupplyBalanceList(message.data.energyRatesHourly)
          systemStore.setTabId(message.data.tabId)
          sendResponse({
            success: true,
          })
          break
        case ActionType.UPDATE_DEMAND_SUPPLY:
          // 收到消息
          dataStore.setDemandSupplyBalanceList(message.data || [])
          sendResponse({
            success: true,
          })
          break
        case ActionType.SHOW_MESSAGE:
          // 显示消息
          const data: any = message.data
          if (
            !isShowTokenExpiration &&
            message.type === ActionType.TOKEN_EXPIRATION
          ) {
            isShowTokenExpiration = true
            messageBox(
              data.title,
              data.message,
              data.type,
              data.showCancelButton,
              data.confirmButtonText,
              data.cancelButtonText
            )
              .then(() => {
                if (message.type === ActionType.TOKEN_EXPIRATION) {
                  systemStore.setActivate(false)
                  isShowTokenExpiration = false
                  stopRun()
                  // 跳转到登录页
                  window.location.href =
                    'https://pm.gx.csg.cn/GXJYQD/index.html#/login'
                }
              })
              .catch(() => {
                if (message.type === ActionType.TOKEN_EXPIRATION) {
                  // 关闭页面
                  isShowTokenExpiration = false
                  systemStore.setActivate(false)
                  stopRun()
                }
              })
          }

          sendResponse({
            success: true,
          })
          break
        case ActionType.RESTORE_POPUP:
          systemStore.setActivate(true)
          // message.data.typeList && dataStore.setTypeList(message.data.typeList)
          sendResponse({
            success: true,
          })
          break
        case ActionType.GET_TABLE_LIST:
          systemStore.setUpdateList()
          sendResponse({
            success: true,
          })
          break
        case ActionType.REFRESH_TYPE_DATA:
          // 刷新类型数据
          dataStore.setTypeList(message.data.types || [])
          break
        case ActionType.REQUEST_PROXY: 
          (async () => {
            const res = await http.request(message.data)
            sendResponse(res)
          })();
          return true;
      }
    }
  )
}
