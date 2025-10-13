<template>
  <el-dialog
    v-loading="loading"
    element-loading-spinner="loading-animation"
    element-loading-background="rgba(255, 255, 255, 0.7)"
    v-model="visible"
    title="查看"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onCancel"
    width="800px"
    top="10vh">
    <Look v-if="visible" v-model="form" :columns="columnsDetails" :cols="2"  />
    <template #footer>
      <div class="dialog-footer text-right justify-end flex gap-5" style="margin-top: 15px">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { MAIN_TYPE, columnsDetails } from './config.js'
const visible = ref(false)
const loading = ref(false)
const form = reactive({})
watch(visible, bool => {
  if (!bool || !form.id) return false
  getDetail()
})
async function getDetail() {
  try {
    loading.value = true
    const res = await bankruptAssetsDetailApi({ id: form.id, type: MAIN_TYPE })
    if (res.success) {
      Object.assign(form, res.data)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading.value = false
  }
}
function onCancel(done) {
  visible.value = false
  if (done) done()
}
defineExpose({ form, visible })
</script>

<style scoped>
:deep(.el-dialog__body) {
  height: 550px;
  overflow: hidden auto;
}
</style>
