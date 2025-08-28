// -- 创建存储一次性 code 的表
// CREATE TABLE IF NOT EXISTS public.login_codes (
//     id BIGSERIAL PRIMARY KEY,               -- 表主键，自增
//     code UUID NOT NULL UNIQUE,              -- 随机一次性 code
//     access_token text,
//     refresh_token text,
//     expires_at TIMESTAMPTZ NOT NULL,       -- code 过期时间
//     created_at TIMESTAMPTZ DEFAULT now()   -- 创建时间
// );

// -- 创建索引提高查询效率（按 code 查）
// CREATE UNIQUE INDEX idx_login_codes_code ON public.login_codes(code);

// -- 可选：定期清理过期 code
// DELETE FROM public.login_codes WHERE expires_at < now();


// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
// 推荐使用 Deno.serve（Supabase docs 建议使用内置 Deno.serve）
Deno.serve(async (req)=>{
  try {
    // 初始化 Supabase 管理客户端（必须用服务角色密钥）
    const supabase = createClient(Deno.env.get("SUPABASE-URL"), Deno.env.get("SUPABASE-SERVICE_ROLE_KEY"));
    // type: code(生成code) web(网页登录) crx(插件登录)
    const { type, payload } = await req.json();
    if (type === 'code') {
      
    }
    const code = crypto.randomUUID()
    await supabase.from('login_codes').insert({ code, user_id: user.id, expires_at: new Date(Date.now() + 1000 * 60 * 2) }) // 2 分钟后过期
    return new Response(JSON.stringify({ code }), {
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