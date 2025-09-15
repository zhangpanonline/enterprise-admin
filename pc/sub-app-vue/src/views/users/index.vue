<template>
  <div class="p-2.5 flex flex-col gap-2.5">
    <header class="h-16 bg-white flex items-center px-5"></header>
    <el-table v-loading="loading" :data="tableData" class="flex-1" stripe style="width: 100%">
      <el-table-column prop="full_name" label="全称" />
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="providers" label="用户来源" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="created_at" label="创建时间" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { AuthUser } from '@supabase/supabase-js'
// import { supabase } from '@/api'
const tableData = ref([])
const loading = ref(true)
fetchData()
async function fetchData() {
  loading.value = true
  const { data, error } = await supabase.functions.invoke('get_users_list', {
    body: { page: 1, perPage: 10 },
  })
  if (error) {
    ElMessage.error(error.message)
  } else {
    tableData.value = data.users.map((v: AuthUser) => ({
      email: v.email,
      created_at: v.created_at,
      phone: v.phone,
      full_name: v.user_metadata.full_name,
      user_name: v.user_metadata.user_name,
      providers: v.app_metadata.providers.join('，'),
    }))
  }
  loading.value = false
}
</script>
