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

setBadge({ text: "ON", color: "#FF0000" })
function setBadge({ text, color }) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  if (text === "ON") {
    setTimeout(() =>{
      setBadge({ text: "OFF", color: "#00FF00" })
    }, 1000)
  } else {
    setTimeout(() =>{
      setBadge({ text: "ON", color: "#FF0000" })
    }, 1000)
  }
}


// 存储数据
chrome.storage.local.set({ key: "value" });
chrome.storage.local.get("key", (data) => console.log(data));

chrome.contextMenus.create({
  id: "myContextMenu", // MV3 必须写
	title: "测试右键菜单",
  contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "myContextMenu") {
    console.log("右键菜单点击事件:", info, tab);
    chrome.notifications.create({
      type: 'basic', // 通知类型：basic / image / list / progress
      iconUrl: 'images/icon2-16.png',
      title: '通知标题',
      message: '这里是通知内容',
      priority: 2 // 优先级，-2 到 2
    });
  }
})

// 请求拦截
const interceptedRequests = {};
chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.tabId > -1) {
      if (interceptedRequests[details.tabId]) {
        interceptedRequests[details.tabId].unshift(details)
      } else {
        interceptedRequests[details.tabId] = [details]
      }
    }
}, {
  urls: ["<all_urls>"] // 监听所有 URL
}, []);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getRequests') {
    sendResponse(interceptedRequests[msg.tabId]);
  }
})