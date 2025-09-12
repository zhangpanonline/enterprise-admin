<template>
  <el-dialog v-model="visible" title="角色编辑" width="500px" @close="close">
    <el-form label-width="80" :model="form">
      <el-form-item label="角色名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Role } from './type'

const emit = defineEmits(['ok'])

const form = defineModel<Partial<Role>>('rowData', {
  default: () => ({ name: '', code: '', description: '' }),
})

const visible = defineModel<boolean>({
  default: false,
})

function close() {
  form.value.id = ''
  form.value.name = ''
  form.value.code = ''
  form.value.description = ''
}

async function handleSave() {
  var error = null
  const { name, code, description, id } = form.value
  if (id) {
    const res = await supabase.from('roles').update({ name, code, description }).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('roles').insert({ name, code, description })
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
