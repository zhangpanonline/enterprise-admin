const script = document.createElement("script");
script.src = chrome.runtime.getURL("/injected.js");
document.documentElement.appendChild(script);
script.remove();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type === "login") {
    chrome.runtime.sendMessage(
      { code: event.data.code, type: "login" },
      (res) => {
        window.postMessage({ type: 'login-response', status: res.status }, "*");
      }
    );
  }
});