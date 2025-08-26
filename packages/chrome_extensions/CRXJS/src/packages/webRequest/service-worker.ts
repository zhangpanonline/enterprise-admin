//   需要开启 webRequest 和 host_permissions 权限
// 文档地址：https://developer.chrome.com/docs/extensions/reference/api/webRequest?hl=zh-cn

// 缓存请求
const cacheRequest = new Map();

// 在即将发生请求时触发
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

    console.log(details, "onBeforeRequest");
    // if (details.tabId > -1 && details.type === "xmlhttprequest") {
    //   if (cacheRequest.has(details.tabId)) {
    //     cacheRequest
    //       .get(details.tabId)
    //       .add({ method: details.method, url: details.url });
    //   } else {
    //     cacheRequest.set(
    //       details.tabId,
    //       new Set([{ method: details.method, url: details.url }])
    //     );
    //   }
    // }
    return void 0;
  },
  { urls: ["<all_urls>"] }
);

// 在发送 HTTP 请求之前（请求标头可用时）触发
chrome.webRequest.onBeforeSendHeaders.addListener(
  (res) => {
    console.log(res, "onBeforeSendHeaders");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 在即将向服务器发送请求之前触发（在 onSendHeaders 触发时，之前 onBeforeSendHeaders 回调的修改可见）
chrome.webRequest.onSendHeaders.addListener(
  (res) => {
    console.log(res, "onSendHeaders");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 在收到请求的 HTTP 响应标头时触发。
chrome.webRequest.onHeadersReceived.addListener(
  (res) => {
    console.log(res, "onHeadersReceived");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 在收到响应正文的第一个字节时触发。对于 HTTP 请求，这意味着状态行和响应标头可用。
chrome.webRequest.onResponseStarted.addListener(
  (res) => {
    console.log(res, "onResponseStarted");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 在请求完成时触发
chrome.webRequest.onCompleted.addListener(
  (res) => {
    console.log(res, "onCompleted");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 发生错误时触发。
chrome.webRequest.onErrorOccurred.addListener(
  (res) => {
    console.log(res, "onErrorOccurred");
    return void 0;
  },
  {
    urls: ["<all_urls>"],
  }
);

// 接收到popup请求
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "request") {
    sendResponse(Array.from(cacheRequest.get(message.tabId) || []));
  }
});
