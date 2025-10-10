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
    width="60%"
    top="10vh">
    <Form v-if="visible" ref="formRef" label-width="110px" v-model="form" cols="3" :columns="columnsForm" :rules="rules">
      <template #endDate>
        <el-col :span="8">
          <el-form-item
            label="到期日期："
            prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              @change="setTime"
              value-format="YYYY-MM-DD">
            </el-date-picker>
            <p class="text-xs text-danger" >到期前30天发送短信提示</p>
          </el-form-item>
        </el-col>
      </template>
    </Form>
    <template #footer>
      <div class="dialog-footer text-right justify-end flex gap-5" style="margin-top: 15px">
        <el-button @click="onCancel()">取 消</el-button>
        <el-button type="primary" @click="onSave()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup >
const eimts = defineEmits(['ok'])
const form = reactive({})
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const route = useRoute()
const rules = {
  voucherCategory: [{ required: true, message: '请选择类目！' }],
  voucherName: [{ required: true, message: '请输入产权名称！' }],
  voucherUser: [{ required: true, message: '请输入产权人！' }],
  voucherType: [{ required: true, message: '请选择产权类型！' }],
}
const columnsFormFiles = reactive({
  label: '上传附件',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    limit: 8,
    extension: ['rar', 'zip', 'doc', 'docx', 'pdf'],
    subType: 'file',
  },
})
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
  columnsFormFiles,
]

watch(visible, bool => {
  if (!bool || !form.id) return false
  getDetail()
})
function setTime(val) {
  var tim2 = new Date(val)
  if (form.startDate) {
    var tim = new Date(form.startDate)
    var tim1 = tim.getTime()
    if (!(tim2.getTime() > tim1 || tim2.getTime() === tim1)) {
      ElMessage.warning('到期日期不能小于注册日期')
      form.endDate = ''
    }
  }
  const tim3 = new Date()

  const tim4 = tim2.getTime() - 8 * 60 * 60 * 1000
  if (tim4 < tim3.getTime() || tim4 === tim3.getTime()) {
    ElMessage.warning('到期日期已过期')
  }
}
async function getDetail() {
  try {
    loading.value = true
    const res = await setKnowledgeVoucherDetails(form.id)
    if (res.success) {
      Object.assign(form, res.data)
      if (Array.isArray(form.files)) {
        form.files = form.files.map(v => ({ ...v, uid: v.id }))
      }
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
      if (Array.isArray(form.files)) {
        form.files = form.files.map((item, index) => ({
          projectId: route.query.projectId,
          fileName: item.fileName,
          filePath: item.filePath,
          fileType: 5,
          id: item.id,
        }))
      }
      const res = await saveOrUpdateKnowledgeVoucher(form)
      if (res.success) {
        ElMessage.success({ message: '操作成功！', showClose: false })
        eimts('ok')
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
