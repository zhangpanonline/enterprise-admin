import { supabase } from "@/supabase";

export function listenerLogin() {
    chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
        if (request.type === "login") {
            // 登录逻辑
            const res = await supabase.from('login_codes').select().eq('code', request.code);
            if (res.status === 200 && Array.isArray(res.data) && res.data?.length > 0) {
                // 登录成功
                sendResponse({ status: "success" })
            } else {
                // 登录失败
                sendResponse({ status: "error" })
            }
        }
        // 异步响应
        return true;
    })
}