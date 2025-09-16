<template>
  <div class="p-2.5 flex flex-col gap-2.5">
    <header class="h-16 bg-white flex items-center px-5">
      <el-input v-model="search" placeholder="搜索版本号" class="w-50!" clearable @change="fetchData()" />
      <el-button class="ml-auto" type="primary" @click="visible = true">添加</el-button>
    </header>
    <el-table class="w-full flex-1" v-loading="loading" :data="tableData" stripe>
      <el-table-column prop="name" label="版本号" />
      <el-table-column prop="created" label="上传时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row, $index }">
          <el-button :disabled="$index !== 0" @click="handleDownload(row.name)">下载</el-button>
          <el-button type="danger" @click="handleDel(row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit v-model="visible" @ok="fetchData()" />
  </div>
</template>

<script lang="ts" setup>
import Edit from './Edit.vue'
import type { Extension } from './type.ts'
const visible = ref(false)
const tableData = ref<Array<Extension>>([])
const loading = ref(true)
const search = ref('')
fetchData()
async function fetchData() {
  loading.value = true
  const { data, error } = await supabase
    .storage
    .from('chrome-extension')
    .list('', {
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
      search: search.value
    })
  if (error) {
    ElMessage.error(error.message)
  } else {
    tableData.value = data.map((v: Extension) => ({ ...v, created: new Date(v.created_at as string).toLocaleString() }))
  }
  loading.value = false
}

const handleDel = (name: Extension['name']) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { error } = await supabase.storage.from('chrome-extension').remove([name as string])
    if (error) {
      ElMessage.error(error.message || '操作失败！')
    } else {
      ElMessage.success('操作成功！')
      fetchData()
    }
  })
}

const handleDownload = async (name: Extension['name']) => {
  const { data, error } = await supabase
  .storage
  .from('chrome-extension')
  .download(name as string)
  if (error) {
    return ElMessage.error(error.message || '下载失败！')
  }
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = name as string
  a.click()
  URL.revokeObjectURL(url)
}
</script>
