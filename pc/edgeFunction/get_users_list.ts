// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
// 推荐使用 Deno.serve（Supabase docs 建议使用内置 Deno.serve）
Deno.serve(async (req)=>{
  const origin = req.headers.get("origin") || ""
  const allowedOrigins = [
    "https://main.zhangpan.online",  // 生产环境
    "https://vue.main.zhangpan.online",  // 生产环境
    "https://nuxt.main.zhangpan.online",  // 生产环境
    "https://next.main.zhangpan.online",  // 生产环境
    "https://localhost:1000",        // 本地调试
    "https://localhost:1001",        // 本地调试
    "https://localhost:1002",        // 本地调试
    "https://localhost:1003",        // 本地调试
  ]
  const headers = new Headers()
  if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    headers.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type")
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }
  try {
    const { page = 1, perPage = 10 } = await req.json();
    // 初始化 Supabase 管理客户端（必须用服务角色密钥）
    const supabase = createClient(Deno.env.get("SUPABASE-URL"), Deno.env.get("SUPABASE-SERVICE_ROLE_KEY"));
    const res = await supabase.auth.admin.listUsers({
      page,
      perPage
    });
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: {
        ...Object.fromEntries(headers),
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        ...Object.fromEntries(headers),
        "Content-Type": "application/json"
      }
    });
  }
});
