// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'

// 推荐使用 Deno.serve（Supabase docs 建议使用内置 Deno.serve）
Deno.serve(async (req) => {
  try {
    const { email, password, ...user_metadata } = await req.json();

    // 初始化 Supabase 管理客户端（必须用服务角色密钥）
    const supabase = createClient(
      Deno.env.get("SUPABASE-URL")!,
      Deno.env.get("SUPABASE-SERVICE_ROLE_KEY")!
    );

    const res = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata
    })

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
