//   需要开启 webRequest 和 host_permissions 权限

// 缓存请求
const cacheRequest = new Map();

// 监听请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // "main_frame"   // 页面本身
    // "sub_frame"    // iframe
    // "script"       // JS 脚本
    // "stylesheet"   // CSS
    // "image"        // 图片
    // "font"         // 字体
    // "xmlhttprequest" // XHR / fetch 请求
    // "media"        // 音视频
    // "other"        // 其他

    console.log(details.type, details);
    if (details.tabId > -1 && details.type === "xmlhttprequest") {
      if (cacheRequest.has(details.tabId)) {
        cacheRequest
          .get(details.tabId)
          .add({ method: details.method, url: details.url });
      } else {
        cacheRequest.set(
          details.tabId,
          new Set([{ method: details.method, url: details.url }])
        );
      }
    }
    return void 0;
  },
  { urls: ["<all_urls>"] }
);

// 接收到popup请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "request") {
    sendResponse(Array.from(cacheRequest.get(message.tabId) || []));
  }
  // 必须 return true 才能异步 sendResponse
  // return true;
});
