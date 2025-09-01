import { supabase } from "@/supabase";

export function listenerLogin() {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === "login") {
      (async () => {
        // 登录逻辑
        try {
          const { data, error } = await supabase
            .from("login_codes")
            .select()
            .eq("code", request.code);

          if (error) {
            sendResponse({ status: error.message });
            return;
          }

          if (data && data.length > 0) {
            const { access_token, refresh_token, expires_at } = data[0];
            if (new Date().getTime() < new Date(expires_at).getTime()) {
              sendResponse({ status: "success" });
              chrome.storage.local.set({ access_token });
              chrome.storage.local.set({ refresh_token });
            } else {
              sendResponse({ status: "token过期" });
            }
          } else {
            sendResponse({ status: "code无效" });
          }
        } catch (err: any) {
          sendResponse({ status: err.message });
        }
      })();
      // 异步响应
      return true;
    }
  });
}
