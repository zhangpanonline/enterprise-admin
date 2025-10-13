<template>
  <div>
    <div class="h-15 font-bold text-base px-5 border-b-8 border-undertone flex justify-between items-center">
      {{ $route.meta.title }}
      <div>
        <el-button @click="router.back()">返回</el-button>
        <el-button type="primary" @click="onConfirm()">{{ buttonName }}</el-button>
      </div>
    </div>
    <div class="h-full-15 overflow-y-auto">
      <div class="w-[900px] mx-auto pt-5">
        <Form
          v-model="form"
          :disabled="!isEdit"
          label-width="110px"
          cols="2"
          ref="formRef"
          :columns="formColumns"
          :rules="rules">
          <template v-if="!isEdit && $route.query.id && form.png" #announcementContent="item">
            <el-col :span="24">
              <el-form-item :label="item.label" :prop="item.prop">
                <div class="border border-info-150 rounded mx-auto">
                  <img :src="VITE_OBS_URL + form.png?.filePath" />
                </div>
              </el-form-item>
            </el-col>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const toolbarConfig = { excludeKeys: ['uploadImage', 'uploadVideo', 'emotion', 'insertImage', 'group-image', 'editImage', 'insertLink', 'insertVideo'] }
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const rules = {
  custodianCompanyName: [{ required: true, message: '请输入管理人' }],
  caseNumber: [{ required: true, message: '请输入案号' }],
  debtorCompanyName: [{ required: true, message: '请输入债务人' }],
  announcementType: [{ required: true, message: '请输入公告分类' }],
  announcementDate: [{ required: true, message: '请选择公告时间' }],
  declareEndDate: [{ required: true, message: '请选择申报截止时间' }],
  announcementTitle: [{ required: true, message: '请输入公告标题' }],
  announcementContent: [{ required: true, message: '请输入公告内容' }],
}
const formRef = ref(null)
const isEdit = computed(() => route.query.isEdit === 'true')
const buttonName = computed(() => {
  if (isEdit.value) {
    return route.query.id ? '修改公告' : '生成公告'
  } else {
    return '下载公告'
  }
})
const form = reactive({
  custodianCompanyName: '', // 管理人
  caseNumber: '', // 案号
  debtorCompanyName: '', // 债务人
  announcementType: '', // 公告分类
  announcementDate: '', // 公告时间
  declareEndDate: '', // 申报截止时间
  announcementTitle: '', // 公告标题
  announcementContent: '', // 公告内容
})
const formColumns = [
  {
    label: '管理人',
    prop: 'custodianCompanyName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入管理人' },
  },
  {
    label: '案号',
    prop: 'caseNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入案号' },
  },
  {
    label: '债务人',
    prop: 'debtorCompanyName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入债务人' },
  },
  {
    label: '公告分类',
    prop: 'announcementType',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入公告分类' },
  },
  {
    label: '公告时间',
    prop: 'announcementDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择公告时间', type: 'datetime' },
  },
  {
    label: '申报截止时间',
    prop: 'declareEndDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择申报截止时间', type: 'date' },
  },
  {
    label: '公告标题',
    prop: 'announcementTitle',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入公告标题' },
  },
  {
    label: '公告内容',
    prop: 'announcementContent',
    el: 'WangEditor',
    cols: 24,
    elAttrs: { toolbarConfig, class: 'border border-info-150 rounded' },
  },
]
const VITE_OBS_URL = import.meta.env.VITE_OBS_URL
onMounted(getDetail)
async function getDetail() {
  if (!route.query.id) return false
  try {
    const res = await announcementGetApi(route.query.id)
    if (res.success) {
      Object.assign(form, res.data)
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
function onConfirm() {
  if (route.query.id && !isEdit.value) {
    obsFileDownload(form.pdf.filePath, form.announcementTitle + useDateFormat(form.announcementDate, ' YYYY年MM月DD日').value + '.pdf')
    return false
  }
  formRef.value.validate(async bool => {
    if (!bool) return false
    try {
      const params = {
        ...form,
        announcementDate: useDateFormat(form.announcementDate, 'YYYY-MM-DD HH:mm:ss').value,
        declareEndDate: useDateFormat(form.declareEndDate, 'YYYY-MM-DD').value,
      }
      params.companyId = appStore.userInfo.companyId
      const res = route.query.id ? await announcementUpdateApi(params) : await announcementSaveApi(params)
      if (res.success) {
        ElMessage({
          message: '操作成功！',
          type: 'success',
        })
        obsFileDownload(res.data.filePath, params.announcementTitle + useDateFormat(form.announcementDate, ' YYYY年MM月DD日').value + '.pdf')
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error) {
      ElMessage.error(error.message)
    }
  })
}
</script>
