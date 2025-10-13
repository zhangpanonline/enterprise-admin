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
    <Form v-if="visible" ref="formRef" label-width="130px" v-model="form" :columns="columnsForm" :rules="rules">
      <template #applyUser>
        <el-col :span="24">
          <el-form-item label="申请人" >
            <el-input v-model="userInfo.userName" placeholder="请输入报销人"  disabled  ></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #applyDate>
        <el-col :span="24">
          <el-form-item label="报销时间" >
            <el-date-picker
                v-model="formattedDate"
                type="date"
                placeholder="Pick a day"
                value-format="YYYY-MM-DD"
                disabled
              />
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

<script setup>
import { MAIN_TYPE, SUB_TYPE, rules, columnsForm } from './config.js'
const emits = defineEmits('ok')
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const { caseInfo } = storeToRefs(useCaseStore())
const { userInfo } = storeToRefs(useAppStore())

const date = new Date();
const formattedDate = date.toISOString().split('T')[0];
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

function onSave() {
  formRef.value.validate(async bool => {
    if (!bool) return false
    try {
      loading.value = true
      if (Array.isArray(form.files)) {
        form.files = form.files.map((item, index) => {
          return {
            projectId: caseInfo.value.projectId,
            fileName: item.fileName,
            filePath: item.filePath,
            fileType: 5,
            id: item.id,
          }
        })
      }
      form.assetsType = MAIN_TYPE
      form.assetsSubType = SUB_TYPE
      form.companyId = form.companyId || userInfo.value.companyId
      form.projectId = form.projectId || caseInfo.value.projectId
      const api = form.id ? bankruptAssetsUpdateApi : bankruptAssetsAddApi
      const res = await api({ type: MAIN_TYPE, bankruptAssetsApplyParam: form })
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
  form.files = null
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
