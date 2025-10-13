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
    <Look v-if="visible" v-model="form" :columns="columnsForm" :cols="2"  />
    <template #footer>
      <div class="dialog-footer text-right justify-end flex gap-5" style="margin-top: 15px">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const visible = ref(false)
const loading = ref(false)
const form = reactive({})
const columnsForm = [
  {
    label: '无形资产名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入文件标题，最长30汉字' },
  },
  {
    label: '无形资产类型',
    prop: 'assetsType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择无形资产类型' },
    options: 'assetsInvisible',
  },
  {
    label: '价值费用（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入费用' },
  },
  {
    label: '编号',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入无形资产编号/证书编码' },
  },
  {
    label: '有效期',
    prop: 'date',
    el: 'ElDatePicker',
    elAttrs: { type: 'daterange', rangeSeparator: '至', startPlaceholder: '开始日期', endPlaceholder: '结束日期' },
  },
  {
    label: '资产内容描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产内容描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  {
    label: '上传附件',
    prop: 'files',
    el: 'HuaweiObsUpload',
    cols: 24,
  },
]
watch(visible, bool => {
  if (!bool || !form.id) return false
  getDetail()
})
async function getDetail() {
  try {
    loading.value = true
    const res = await detailAssetsInvisibleApi(form.id)
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
