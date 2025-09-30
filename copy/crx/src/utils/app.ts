export function getAppName() {
  const manifest = chrome.runtime.getManifest()
  return manifest.name
}

/**
 * 生成erhId
 * @param code 交易编码
 * @param seqId 类型 seqId
 * @param tradeUnitId 交易单元id
 * @returns
 */
export function getRrhId(
  code: string | number,
  seqId: string | number,
  tradeUnitId: string | number
) {
  return `${code}_${seqId}_${tradeUnitId}`
}

/**
 * 生成dsbId
 * @param code 交易编码
 * @param seqId 类型ID
 * @returns
 */
export function getDsbId(code: string | number, seqId: string | number) {
  return `${code}_${seqId}`
}

export function getManifest() {
  return chrome.runtime.getManifest()
}

export function getHostPermissions(): string[] {
  const manifest = getManifest()
  return manifest.host_permissions.map((url: string) => {
    if (url.endsWith('/*')) {
      return url.replace('/*', '/')
    }
    return url
  })
}
