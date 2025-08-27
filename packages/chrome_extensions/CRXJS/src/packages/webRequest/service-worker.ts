//   需要开启 webRequest 和 host_permissions 权限
// 文档地址：https://developer.chrome.com/docs/extensions/reference/api/webRequest?hl=zh-cn

export default function listenerWebRequest () {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "start_web_request") {
      sendResponse({
        status: "ok",
      });
      startWebRequest();
    } else if (message.type === "stop_web_request") {
      sendResponse({
        status: "ok",
      });
      stopWebRequest();
    }
  });
}

function startWebRequest() {
  // 在即将发生请求时触发
  chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, filter, [
    "requestBody",
  ]);

  // 在发送 HTTP 请求之前（请求标头可用时）触发
  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeaders,
    filter
  );

  // 在即将向服务器发送请求之前触发（在 onSendHeaders 触发时，之前 onBeforeSendHeaders 回调的修改可见）
  chrome.webRequest.onSendHeaders.addListener(onSendHeaders, filter);

  // 在收到请求的 HTTP 响应标头时触发。
  chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter);

  // 在收到响应正文的第一个字节时触发。对于 HTTP 请求，这意味着状态行和响应标头可用。
  chrome.webRequest.onResponseStarted.addListener(onResponseStarted, filter);

  // 在请求完成时触发
  chrome.webRequest.onCompleted.addListener(onCompleted, filter);

  // 发生错误时触发。
  chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, filter);
}

function stopWebRequest() {
  chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
  chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders);
  chrome.webRequest.onSendHeaders.removeListener(onSendHeaders);
  chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);
  chrome.webRequest.onResponseStarted.removeListener(onResponseStarted);
  chrome.webRequest.onCompleted.removeListener(onCompleted);
  chrome.webRequest.onErrorOccurred.removeListener(onErrorOccurred);
}

// 请求记录
const Session_Key = "requestLogs";
const filter: chrome.webRequest.RequestFilter = { urls: ["<all_urls>"] };
function onBeforeRequest(details: chrome.webRequest.OnBeforeRequestDetails) {
  // detail.type ===>
  // "main_frame"   // 页面本身
  // "sub_frame"    // iframe
  // "script"       // JS 脚本
  // "stylesheet"   // CSS
  // "image"        // 图片
  // "font"         // 字体
  // "xmlhttprequest" // XHR / fetch 请求
  // "media"        // 音视频
  // "other"        // 其他
  const { tabId, url, requestId, type, method, requestBody } = details;
  chrome.storage.session.get(Session_Key, (res) => {
    const requestLogs = res[Session_Key] || {};
    if (!requestLogs[tabId]) requestLogs[tabId] = {};
    requestLogs[tabId][requestId] = {
      type,
      url,
      method,
      requestBody,
      startTime: Date.now(),
      status: "pending",
    };

    chrome.storage.session.set({ [Session_Key]: requestLogs });
  });
  return void 0;
}

function onBeforeSendHeaders(
  _details: chrome.webRequest.OnBeforeSendHeadersDetails
) {
  return void 0;
}

function onSendHeaders(_details: chrome.webRequest.OnSendHeadersDetails) {
  return void 0;
}

function onHeadersReceived(
  _details: chrome.webRequest.OnHeadersReceivedDetails
) {
  return void 0;
}

function onResponseStarted(
  _details: chrome.webRequest.OnResponseStartedDetails
) {
  return void 0;
}

function onCompleted(details: chrome.webRequest.OnCompletedDetails) {
  const { tabId, requestId, statusCode } = details;
  chrome.storage.session.get(Session_Key, (res) => {
    const requestLogs = res[Session_Key] || {};
    const log = requestLogs[tabId]?.[requestId];
    if (log) {
      log.endTime = Date.now();
      log.duration = log.endTime - log.startTime;
      log.status = statusCode;
    }
    chrome.storage.session.set({ [Session_Key]: requestLogs })
  });
  return void 0;
}

function onErrorOccurred(details: chrome.webRequest.OnErrorOccurredDetails) {
  const { tabId, requestId, error } = details;
  chrome.storage.session.get(Session_Key, (res) => {
    const requestLogs = res[Session_Key] || {};
    const log = requestLogs[tabId]?.[requestId];
    if (log) {
      log.endTime = Date.now();
      log.duration = log.endTime - log.startTime;
      log.status = "ERROR";
      log.error = error;
    }
    chrome.storage.session.set({ [Session_Key]: requestLogs })
  });
  return void 0;
}
