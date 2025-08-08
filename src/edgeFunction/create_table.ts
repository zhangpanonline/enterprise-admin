// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'

// 推荐使用 Deno.serve（Supabase docs 建议使用内置 Deno.serve）
Deno.serve(async (req) => {
  try {
    const { tableName } = await req.json();

    // 初始化 Supabase 管理客户端（必须用服务角色密钥）
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE-URL")!,
      Deno.env.get("SUPABASE-SERVICE_ROLE_KEY")!
    );

    const sql = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz DEFAULT now()
      );
    `;

    // 执行 SQL（调用 Supabase RPC 执行函数或直接用 PostgREST 执行）
    // 注意：官方不推荐直接用客户端执行原始 SQL，通常你需要在数据库中先建好 rpc 函数，调用函数执行SQL。
    // 这里演示调用 rpc：execute_sql(statement text)
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { statement: sql });

    if (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
