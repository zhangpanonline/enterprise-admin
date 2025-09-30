import {
  TOKEN,
  SYSTEM_PREFIX,
  CURRENT_LOAD_DATE,
  CURRENT_LISTEN_TYPE,
  CURRENT_TYPE,
  CURRENT_BMET_TYPE,
  CURRENT_TAB_ID_LIST,
  MINIMIZE_TAB_CURRENT_TAB_ID_LIST,
  IS_LOAD_DATA,
  UKEY_INFO,
  SYSTEM_CURRENT_DATE,
} from '@/constants'
// COOKIES,
import db from '@/utils/dexie'

export async function getCurrentTabIdList() {
  // return new Promise<number[]>((resolve) => {
  //   chrome.storage.local.get([getKey(CURRENT_TAB_ID_LIST)], (result) => {
  //     resolve(result[getKey(CURRENT_TAB_ID_LIST)] || [])
  //   })
  // })

  const result = await db.system_info.get(getKey(CURRENT_TAB_ID_LIST))
  return Promise.resolve(result?.value || [])
}
export async function setCurrentTabIdList(tableId: number) {
  const list = await getCurrentTabIdList()
  if (!list.includes(tableId)) list.push(tableId)
  db.system_info.put({ id: getKey(CURRENT_TAB_ID_LIST), value: list })
  // chrome.storage.local.set({ [getKey(CURRENT_TAB_ID_LIST)]: list }, () => {
  //   return Promise.resolve(list)
  // })
  return Promise.resolve(list)
}

export async function removeCurrentTabIdList(tableId: number) {
  const list = await getCurrentTabIdList()

  const index = list.indexOf(tableId)
  if (index !== -1) {
    list.splice(index, 1)
  }
  if (list.length == 0) {
    db.system_info.delete(getKey(CURRENT_TAB_ID_LIST))
    return Promise.resolve([])
  }
  db.system_info.put({ id: getKey(CURRENT_TAB_ID_LIST), value: list })
  return Promise.resolve(list)
}

export function clearCurrentTabIdList() {
  db.system_info.delete(getKey(CURRENT_TAB_ID_LIST))
}

export async function getMinimizeTabIdList() {
  // return new Promise<number[]>((resolve) => {
  //   chrome.storage.local.get(
  //     [getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST)],
  //     (result) => {
  //       resolve(result[getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST)] || [])
  //     }
  //   )
  // })
  const result = await db.system_info.get(
    getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST)
  )
  return Promise.resolve(result?.value || [])
}
export async function setMinimizeTabIdList(tabId: number) {
  const tabIdList = await getMinimizeTabIdList()
  tabIdList.push(tabId)
  db.system_info.put({
    id: getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST),
    value: tabIdList,
  })
  return Promise.resolve(tabIdList)
}

export async function removeMinimizeTabIdList(tabId: number) {
  const tabIdList = await getMinimizeTabIdList()
  const index = tabIdList.indexOf(tabId)
  if (index !== -1) {
    tabIdList.splice(index, 1)
  }

  if (tabIdList.length === 0) {
    db.system_info.delete(getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST))
    return Promise.resolve([])
  }
  db.system_info.put({
    id: getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST),
    value: tabIdList,
  })
  return Promise.resolve(tabIdList)
}

export function clearMinimizeTabIdList() {
  db.system_info.delete(getKey(MINIMIZE_TAB_CURRENT_TAB_ID_LIST))
}

export async function setIsLoadData(isLoadData: boolean) {
  await db.system_info.put({ id: getKey(IS_LOAD_DATA), value: isLoadData })
}

export async function getIsLoadData() {
  const result = await db.system_info.get(getKey(IS_LOAD_DATA))
  return Promise.resolve(result?.value || false)
}

export async function setSystemCurrentDate(date: string) {
  await db.system_info.put({ id: getKey(SYSTEM_CURRENT_DATE), value: date })
}

export async function getSystemCurrentDate() {
  const result = await db.system_info.get(getKey(SYSTEM_CURRENT_DATE))
  return Promise.resolve(result?.value || '')
}

/**
 * @Author: zhangrui zhangrui@glhz.team
 * @Date: 2025-07-01 16:29:39
 * @Description: 保存 交易中心的token 和 所有Cookie 到插件本地
 */
export function setToken(token: string) {
  db.system_info.put({ id: getKey(TOKEN), value: token })
}

export function clearToken() {
  db.system_info.delete(getKey(TOKEN))
}

export function getToken() {
  return new Promise<string>((resolve) => {
    // chrome.storage.local.get([getKey(TOKEN)], (result) => {
    //   resolve(result[getKey(TOKEN)] || '')
    // })
    db.system_info
      .get(getKey(TOKEN))
      .then((result) => {
        resolve(result?.value || '')
      })
      .catch(() => resolve(''))
  })
}

export function setUKeyInfo(UKeyInfo: string) {
  db.system_info.put({ id: getKey(UKEY_INFO), value: UKeyInfo })
}

export function clearUKeyInfo() {
  db.system_info.delete(getKey(UKEY_INFO))
}

export function getUKeyInfo() {
  return new Promise<any>((resolve) => {
    // chrome.storage.local.get([getKey(UKeyInfo)], (result) => {
    //   resolve(result[getKey(UKeyInfo)] || '')
    // })
    db.system_info
      .get(getKey(UKEY_INFO))
      .then((result) => {
        resolve(JSON.parse(result?.value || '{}'))
      })
      .catch(() => resolve(''))
  })
}

// export function setCookies(cookies: string) {
//   db.system_info.put({ id: getKey(COOKIES), value: cookies })
// }
// export function getCookies() {
//   return new Promise<string>((resolve) => {
//     // chrome.storage.local.get([getKey(COOKIES)], (result) => {
//     //   resolve(result[getKey(COOKIES)] || '')
//     // })
//     db.system_info
//       .get(getKey(COOKIES))
//       .then((result) => {
//         resolve(result?.value || '')
//       })
//       .catch(() => resolve(''))
//   })
// }

export function setCurrentLoadDate(date: string) {
  // chrome.storage.local.set({ [getKey(CURRENT_LOAD_DATE)]: date })
  db.system_info.put({ id: getKey(CURRENT_LOAD_DATE), value: date })
}

export async function clearCurrentLoadDate() {
  // chrome.storage.local.remove(getKey(CURRENT_LOAD_DATE))
  await db.system_info.delete(getKey(CURRENT_LOAD_DATE))
}

export function getCurrentLoadDate() {
  return new Promise<string>((resolve) => {
    // chrome.storage.local.get([getKey(CURRENT_LOAD_DATE)], (result) => {
    //   resolve(result[getKey(CURRENT_LOAD_DATE)] || '')
    // })
    db.system_info
      .get(getKey(CURRENT_LOAD_DATE))
      .then((result) => {
        resolve(result?.value || '')
      })
      .catch(() => resolve(''))
  })
}

export function setCurrentListenType(ids: number[]) {
  // chrome.storage.local.set({ [getKey(CURRENT_LISTEN_TYPE)]: date })
  db.system_info.put({
    id: getKey(CURRENT_LISTEN_TYPE),
    value: JSON.stringify(ids),
  })
}

export async function clearCurrentListenType() {
  // chrome.storage.local.remove(getKey(CURRENT_LISTEN_TYPE))
  await db.system_info.delete(getKey(CURRENT_LISTEN_TYPE))
}

export function getCurrentListenType() {
  return new Promise<number[]>((resolve) => {
    // chrome.storage.local.get([getKey(CURRENT_LISTEN_TYPE)], (result) => {
    //   resolve(result[getKey(CURRENT_LISTEN_TYPE)] || '')
    // })
    db.system_info
      .get(getKey(CURRENT_LISTEN_TYPE))
      .then((result) => {
        if (result) {
          resolve(JSON.parse(result.value))
        }
        resolve([])
      })
      .catch(() => resolve([]))
  })
}

export async function setCurrentBMETType(ids: number[]) {
  // chrome.storage.local.set({ [getKey(CURRENT_LISTEN_TYPE)]: date })
  await db.system_info.put({
    id: getKey(CURRENT_BMET_TYPE),
    value: JSON.stringify(ids),
  })
}

export async function clearCurrentBMETType() {
  await db.system_info.delete(getKey(CURRENT_BMET_TYPE))
}

export function getCurrentBMETType() {
  return new Promise<number[]>((resolve) => {
    // chrome.storage.local.get([getKey(CURRENT_LISTEN_TYPE)], (result) => {
    //   resolve(result[getKey(CURRENT_LISTEN_TYPE)] || '')
    // })
    db.system_info
      .get(getKey(CURRENT_BMET_TYPE))
      .then((result) => {
        if (result) {
          resolve(JSON.parse(result.value))
        }
        resolve([])
      })
      .catch(() => resolve([]))
  })
}

export async function setCurrentType(type: string | number) {
  // chrome.storage.local.set({ [getKey(CURRENT_LISTEN_TYPE)]: date })
  await db.system_info.put({ id: getKey(CURRENT_TYPE), value: type })
}

export async function clearCurrentType() {
  await db.system_info.delete(getKey(CURRENT_TYPE))
}

export function getCurrentType() {
  return new Promise<number | undefined>((resolve) => {
    // chrome.storage.local.get([getKey(CURRENT_LISTEN_TYPE)], (result) => {
    //   resolve(result[getKey(CURRENT_LISTEN_TYPE)] || '')
    // })
    db.system_info
      .get(getKey(CURRENT_TYPE))
      .then((result) => {
        resolve(result?.value || undefined)
      })
      .catch(() => resolve(undefined))
  })
}

export async function getCurrentStartType() {
  const BMETList = await getCurrentBMETType()
  const listenTypes = await getCurrentListenType()
  const list = [...BMETList, ...listenTypes]
  return Promise.resolve(list)
}

function getKey(key: string) {
  return SYSTEM_PREFIX + key
}
