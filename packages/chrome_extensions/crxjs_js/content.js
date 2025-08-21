console.log('content.js')
document.title = 'CRXJS'

// 发送消息给后台
chrome.runtime.sendMessage({ type: "PAGE_LOADED" }, res => {
    console.log( '后台返回消息：' ,res)
});

// // 监听来自后台的消息
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log( '收到后台消息：' , request)
//     sendResponse('已收到请求拦截消息')
// })