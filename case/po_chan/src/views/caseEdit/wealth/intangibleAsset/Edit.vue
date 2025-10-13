<template>
  <el-dialog
    v-loading="loading"
    element-loading-spinner="loading-animation"
    element-loading-background="rgba(255, 255, 255, 0.7)"
    v-model="visible"
    :title="form.id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onCancel"
    width="600px"
    top="10vh">
    <Form v-if="visible" ref="formRef" label-width="110px" v-model="form" :columns="columnsForm" :rules="rules">
    </Form>
    <template #footer>
      <div class="dialog-footer text-right justify-end flex gap-5" style="margin-top: 15px">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const emits = defineEmits('ok')
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const route = useRoute()
const rules = {
  assetsName: [{ required: true, message: '请输入无形资产名称' }],
  assetsType: [{ required: true, message: '请选择无形资产类型' }],
}
const form = reactive({})
const columnsFormFiles = reactive({
  label: '上传附件',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    extension: ['rar', 'zip', 'doc', 'docx', 'pdf'],
    tips: '支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过500MB',
    text: '选择附件',
  },
})
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
  columnsFormFiles,
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
      form.date = [form.startDate, form.endDate]
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

function onSave() {
  formRef.value.validate(async bool => {
    if (!bool) return false
    try {
      loading.value = true
      if (Array.isArray(form.date) && form.date.length > 0) {
        form.startDate = useDateFormat(form.date[0], 'YYYY-MM-DD').value
        form.endDate = useDateFormat(form.date[1], 'YYYY-MM-DD').value
      }
      if (Array.isArray(form.files)) {
        form.files = form.files.map((item, index) => {
          return {
            projectId: route.query.projectId,
            fileName: item.fileName,
            filePath: item.filePath,
            fileType: 5,
            id: item.id,
          }
        })
      }
      const res = await updateAssetsInvisibleApi(form)
      if (res.success) {
        ElMessage.success({ message: '操作成功！', showClose: false })
        emits('ok')
        onCancel()
      } else {
        ElMessage.error({ message: res.msg, showClose: false })
      }
    } catch (error) {
      console.error(error)
      ElMessage.error({ message: error.message, showClose: false })
    } finally {
      loading.value = false
    }
  })
}
function onCancel(done) {
  visible.value = false
  formRef.value.resetFields()
  for (const key in form) {
    form[key] = ''
  }
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
