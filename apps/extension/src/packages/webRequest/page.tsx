import { useState, useEffect } from "react";

type WebRequestData = {
  method: string;
  url: string;
  status: number;
  type: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export default function WebRequest() {
  const [data, setData] = useState<Array<WebRequestData>>([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.runtime.sendMessage({ type: "start_web_request" }, () => {
          chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "session") {
              if (changes.requestLogs?.newValue[tabId!]) {
                setData(Object.values(changes.requestLogs?.newValue[tabId!]!).reverse() as Array<WebRequestData>);
              }
            }
          });
        });
      }
    });
    return () => {
      chrome.runtime.sendMessage({ type: "stop_web_request" });
    };
  }, []);
  return (
    <div>
      {data.map((item, idx) => {
        return (
          <div key={idx} className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="collapse" defaultChecked={idx === 0} />
            <div className="collapse-title font-semibold overflow-hidden">
              <div className="flex gap-2 items-center" >
                <div className="inline-grid *:[grid-area:1/1]">
                  <div className={ "status animate-ping " + (item.status === 200 ? "status-success" : "status-error") }></div>
                  <div className={ "status " + (item.status === 200 ? "status-success" : "status-error") }></div>
                </div>
                <button className="btn btn-soft btn-accent btn-sm btn-square min-w-fit px-2">{item.status}</button>
                <button className="btn btn-soft btn-primary btn-sm btn-square min-w-fit px-2">{item.method}</button>
                <button className="btn btn-soft btn-info btn-sm btn-square min-w-fit px-2">{item.type}</button>
                <button className="btn btn-soft btn-warning btn-sm btn-square min-w-fit px-2">{item.duration}</button>
                <button className="btn btn-soft btn-info btn-sm btn-square min-w-fit px-2">{new Date(item.startTime).toLocaleString().slice(10)}</button>
              </div>
              <a className="overflow-hidden inline-block w-[inherit]" >{item.url}</a>
            </div>
            <div className="collapse-content text-sm">
              .............
            </div>
          </div>
        )
      })}
      
    </div>
  );
}
