
export default function onMessage() {
    chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
      if (message.type === 'notifications') {
        console.log('通知信息：', message)
        chrome.notifications.create(message.options)
      }
    })
}