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
  </el-dialog>
</template>

<script setup>
import { columnsDetails } from './config.js'
const visible = ref(false)
const loading = ref(false)
const form = reactive({})
watch(visible, bool => {
  if (!bool || !form) return false
  getDetail()
})
async function getDetail () {
  try {
    form.files = []
    loading.value = true
    console.log(form.extras)
    form.files = JSON.parse(form.extras.replaceAll('"[', '[').replaceAll(']"', ']')).file
  } catch (error) {
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
