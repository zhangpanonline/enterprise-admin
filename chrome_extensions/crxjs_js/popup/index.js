document.addEventListener('DOMContentLoaded', () => {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.runtime.sendMessage({type: 'getRequests', tabId: tabs[0].id}, (res) => {
                const list = document.getElementById("requests");
                list.innerHTML = ""; // 清空旧的
                res.forEach((req) => {
                    const li = document.createElement("li");
                    li.textContent = `[${req.method}] ${req.url}`;
                    list.appendChild(li);
                });
            })
        }
    })
})
