import { useState } from "react";

export default function WebRequest() {
  const [data, setData] = useState<Array<{ method: string; url: string }>>([]);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.runtime.sendMessage(
        { type: "request", tabId: tabs[0].id },
        (res) => {
          if (chrome.runtime.lastError) {
            console.error("消息发送失败：", chrome.runtime.lastError.message);
            return;
          }
          console.log("popup 请求拦截:", res);
          setData(res);
        }
      );
    }
  });

  return (
    <ul>
      {data.map((item) => (
        <li key={item.url}>
          {item.method}：{item.url}
        </li>
      ))}
    </ul>
  );
}
