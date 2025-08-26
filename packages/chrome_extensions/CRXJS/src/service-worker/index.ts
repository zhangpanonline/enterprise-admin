import '@/packages/webRequest/service-worker'
import listenerOnMessage from './onMessage'

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

chrome.runtime.onInstalled.addListener(() => {
  listenerOnMessage()
})