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
    <Look v-if="visible" v-model="form" :columns="columnsForm" :cols="3"  />
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
    label: '类目',
    prop: 'voucherCategory',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择类目' },
    options: 'voucherCategory',
  },
  {
    label: '产权名称',
    prop: 'voucherName',
    el: 'ElInput',
    elAttrs: { placeholder: '请选择产权名称' },
  },
  {
    label: '产权人',
    prop: 'voucherUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入产权人' },
  },
  {
    label: '产权类型',
    prop: 'voucherType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择产权类型' },
    options: 'voucherType',
  },
  {
    label: '权利归属',
    prop: 'voucherOwnership',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择权利归属' },
    options: 'voucherOwnership',
  },
  {
    label: '权利范围',
    prop: 'voucherRadius',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择权利范围' },
    options: 'voucherRadius',
  },
  {
    label: '注册日期',
    prop: 'startDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '选择注册日期', type: 'date', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '到期日期',
    prop: 'endDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '选择到期日期', type: 'date', format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '登记号',
    prop: 'voucherNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入登记号' },
  },
  {
    label: '产权说明',
    prop: 'voucherRemark',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入产权说明', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 5000 },
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
    const res = await setKnowledgeVoucherDetails(form.id)
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
