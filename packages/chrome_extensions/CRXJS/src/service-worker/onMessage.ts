export default function onMessage() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('onMessage', message)
    if (message.type === 'notifications') {
      chrome.notifications.create(message.options)
    }
  })
}