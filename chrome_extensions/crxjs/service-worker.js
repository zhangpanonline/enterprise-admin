console.log('service-worker.js')

// 监听扩展生命周期事件
chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装");
});

// 监听浏览器事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab 更新:", tab.url);
});

// 与 content_scripts 通信
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PAGE_LOADED") {
    sendResponse('已接收到消息');
  }
});


// 存储数据
chrome.storage.local.set({ token: "abc123" });
chrome.storage.local.get("token", (data) => console.log(data));

