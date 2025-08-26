// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
// 推荐使用 Deno.serve（Supabase docs 建议使用内置 Deno.serve）
Deno.serve(async (req)=>{
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
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
