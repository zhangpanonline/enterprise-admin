export function getFileUrl(filePath: string): string {
  return chrome.runtime.getURL(filePath)
}
