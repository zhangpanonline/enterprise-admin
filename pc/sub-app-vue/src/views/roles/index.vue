<template>
  <div class="p-2.5 flex flex-col gap-2.5">
    <header class="h-16 bg-white flex items-center px-5">
      <el-button class="ml-auto" type="primary" @click="visible = true">添加</el-button>
    </header>
    <el-table class="w-full flex-1" v-loading="loading" :data="tableData" stripe>
      <el-table-column prop="name" label="角色" />
      <el-table-column prop="code" label="编码" />
      <el-table-column prop="created" label="创建时间" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            @click="
              Object.assign(rowData, row),
              visible = true
            "
            >编辑</el-button
          >
          <el-button type="danger" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit v-model="visible" v-model:row-data="rowData" @ok="fetchData()" />
  </div>
</template>

<script lang="ts" setup>
import Edit from './Edit.vue'
import type { Role } from './type'
const visible = ref(false)
const rowData = reactive<Role | {}>({})
const tableData = ref<Array<Role>>([])
const loading = ref(true)
fetchData()
async function fetchData() {
  loading.value = true
  const { data, error } = await supabase
    .from('roles')
    .select()
    .order('created_at', { ascending: true })
  if (error) {
    ElMessage.error(error.message)
  } else {
    tableData.value = data.map((v) => ({ ...v, created: new Date(v.created_at).toLocaleString() }))
  }
  loading.value = false
}

const handleDel = (id: Role['id']) => {
       ElMessageBox.confirm('确定删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const { error } = await supabase.from('roles').delete().eq('id', id)
        if (error) {
            ElMessage.error(error.message || '操作失败！')
        } else {
            fetchData()
        }
    })
}
</script>
