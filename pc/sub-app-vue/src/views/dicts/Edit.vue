<template>
  <el-dialog v-model="visible" title="字典编辑" width="500px" @close="close">
    <el-form label-width="80" :model="form">
      <el-form-item label="字典名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="字典编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="字典键">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="字典值">
        <el-input v-model="form.value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Dict } from './type.ts'

const emit = defineEmits(['ok'])

const form = defineModel<Partial<Dict>>('rowData', {
  default: () => ({ name: '', code: '', key: '', value: '' }),
})

const visible = defineModel<boolean>({
  default: false,
})

function close() {
  form.value.id = ''
  form.value.name = ''
  form.value.code = ''
  form.value.key = ''
  form.value.value = ''
}

async function handleSave() {
  var error = null
  const { name, code, key, value, id } = form.value
  if (id) {
    const res = await supabase.from('dicts').update({ name, code, key, value }).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('dicts').insert({ name, code, key, value })
    error = res.error
  }
  if (error) {
    return ElMessage.error(error.message || '操作失败！')
  }
  ElMessage.success('操作成功！')
  visible.value = false
  emit('ok')
}
</script>
