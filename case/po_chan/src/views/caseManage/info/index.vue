<template>
  <div class="!bg-undertone overflow-y-auto" v-loading="loading" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.9)" >
    <div class="bg-white hover:shadow h-27.5 rounded flex justify-around flex-col mb-3 p-5" >
      <!-- 当前案件名称 -->
      <p>{{ caseInfo.caseName || '-' }}</p>
      <!-- 当前案件基本信息 -->
      <ul class="flex justify-start gap-5" >
        <li>
          <span class="text-sm text-black-150 mr-3" >债务人</span>
          <span class="text-sm text-black-300" >{{ caseInfo['debtorCompanyName'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >管理人</span>
          <span class="text-sm text-black-300" >{{ caseInfo['companyName'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >案号</span>
          <span class="text-sm text-black-300" >{{ caseInfo['caseNumber'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >债权申报截止日期</span>
          <span class="text-sm text-black-300" >{{ caseInfo['declareEndDate'] || '-' }}</span>
        </li>
      </ul>
    </div>
    <Form
      class="bg-white p-5 rounded hover:shadow"
      ref="formRef"
      label-position="top"
      v-model="form"
      cols="3"
      :rules="rules"
      scroll-to-error
      :columns="columns">
      <template #managerDecisionFileFileNumber>
        <el-col :span="8">
          <el-form-item label="指定破产管理人决定书" prop="managerDecisionFileFileNumber" class="relative">
            <span
              v-if="inFileList.managerDecisionFile[0]"
              :style="{ 'grid-template-columns': caseInfo.isEdit ? '1fr min-content min-content' : '1fr min-content' }"
              class="w-full gap-3 absolute right-0 top-[-28px] grid text-right items-center justify-end">
              <i :title="inFileList.managerDecisionFile[0]['fileName']" class="text-xs text-info overflow-hidden text-ellipsis text-right pl-[40%]">{{ inFileList.managerDecisionFile[0]['fileName'] }}</i>
              <ElIcon class="cursor-pointer" @click="onDownload('managerDecisionFile')" title="下载">
                <IconEpDownload />
              </ElIcon>
              <el-popover v-if="caseInfo.isEdit" placement="top">
                <p>确定删除？</p>
                <div class="text-right m-0">
                  <el-button type="primary" @click="onDelObsFile('manager')">确定</el-button>
                </div>
                <template #reference>
                  <el-icon color="red" ><IconEpDelete /></el-icon>
                </template>
              </el-popover>
            </span>
            <HuaweiObsUpload
              v-else-if="!inFileList.managerDecisionFile[0] && caseInfo.isEdit"
              :show-file-list="false"
              :limit="1"
              :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
              :in-file-list="inFileList.managerDecisionFile"
              class="absolute right-0 top-[-34px] cursor-pointer text-info text-right hover:text-undertone before:content-['*'] before:absolute before:right-[3.5em] before:top-[0.1em] before:text-danger"
              system-type="dept"
              temp-file="tempFile"
              @getPercent="$event => progress.manager = Number($event)"
              @returnFile="$event => onReturnFile($event, 'manager')">
              <el-progress v-if="progress.manager > 0" :percentage="progress.manager" :format="$event => $event === 100 ? '99%' : `${$event}%`" color="#67c23a" class="w-50"></el-progress>
              <span class="text-xs text-primary" v-else>上传文件</span>
            </HuaweiObsUpload>
            <el-input v-model="form.managerDecisionFileFileNumber" :disabled="!caseInfo.isEdit" placeholder="请输入决定书文号"></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #liquidationOrderFileFileNumber>
        <el-col :span="8">
          <el-form-item label="受理破产清算裁定书" prop="liquidationOrderFileFileNumber" class="relative">
            <span
              v-if="inFileList.liquidationOrderFile[0]"
              :style="{ 'grid-template-columns': caseInfo.isEdit ? '1fr min-content min-content' : '1fr min-content' }"
              class="w-full gap-3 absolute right-0 top-[-28px] grid text-right items-center justify-end">
              <i :title="inFileList.liquidationOrderFile[0]['fileName']" class="text-xs text-info overflow-hidden text-ellipsis text-right pl-[40%]">{{ inFileList.liquidationOrderFile[0]['fileName'] }}</i>
              <ElIcon class="cursor-pointer" @click="onDownload('liquidationOrderFile')" title="下载">
                <IconEpDownload />
              </ElIcon>
              <el-popover v-if="caseInfo.isEdit" placement="top">
                <p>确定删除？</p>
                <div class="text-right m-0">
                  <el-button type="primary" @click="onDelObsFile('liquidation')">确定</el-button>
                </div>
                <template #reference>
                  <el-icon color="red" ><IconEpDelete /></el-icon>
                </template>
              </el-popover>
            </span>
            <HuaweiObsUpload
              v-else-if="!inFileList.liquidationOrderFile[0] && caseInfo.isEdit"
              :show-file-list="false"
              :limit="1"
              :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
              :in-file-list="inFileList.liquidationOrderFile"
              class="absolute right-0 top-[-34px] cursor-pointer text-info text-right hover:text-undertone before:content-['*'] before:absolute before:right-[3.5em] before:top-[0.1em] before:text-danger"
              system-type="dept"
              temp-file="tempFile"
              @getPercent="$event => progress.liquidation = Number($event)"
              @returnFile="$event => onReturnFile($event, 'liquidation')">
              <el-progress v-if="progress.liquidation > 0" :percentage="progress.liquidation" :format="$event => $event === 100 ? '99%' : `${$event}%`" color="#67c23a" class="w-50"></el-progress>
              <span class="text-xs text-primary" v-else>上传文件</span>
            </HuaweiObsUpload>
            <el-input v-model="form.liquidationOrderFileFileNumber" :disabled="!caseInfo.isEdit" placeholder="请输入裁定书文号"></el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #notice>
        <el-col :span="24">
          <el-form-item label="公告说明" prop="notice">
            <template #label >
              <span>公告说明</span>
              <el-button v-if="form.announcementPng && form.announcementPng.filePath" class="ml-5" size="small" type="primary" @click="onPreviewBulletin(form.announcementPng.filePath)" >
                <template #icon>
                  <IconEpView />
                </template>
                公告预览
              </el-button>
              <el-button v-if="form.announcementPdf && form.announcementPdf.filePath" class="ml-5" size="small" type="primary" @click="onDownloadBulletin(form.announcementPdf.filePath, form.announcementPdf.fileName, form.announcementPdf.createTime)" >
                <template #icon>
                  <IconEpDownload />
                </template>
                公告下载
              </el-button>
            </template>
            <div class="border border-info-50 rounded p-3 w-full max-h-75 overflow-y-auto overflow-x-hidden bg-[#F7FaFa]" v-html="form.notice" ></div>
          </el-form-item>
        </el-col>
      </template>
    </Form>
    <footer
      v-if="caseInfo.isEdit"
      class="bg-white w-full p-5 flex justify-center gap-3 box-border text-sm items-center">
      <el-button @click="$router.back()">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="onSave()">{{ form.createUser ? '保 存' : '受理案件并保存' }}</el-button>
      <el-popover
        v-loading="loading"
        v-if="form.createUser"
        placement="bottom-start"
        trigger="click">
        <ul class="text-center cursor-pointer flex flex-col gap-3">
          <li @click="fetchNumApi()">
            <el-icon><IconEpCheck /></el-icon>
            案件结案
          </li>
          <li class="text-danger" @click="onChangeStauesDel()">
            <el-icon><IconEpDelete /></el-icon>
            案件删除
          </li>
        </ul>
        <template #reference>
          <span class="cursor-pointer text-info">
            更多
            <el-icon><IconEpArrowDown /></el-icon>
          </span>
        </template>
      </el-popover>
    </footer>
  </div>
</template>

<script setup>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const { caseInfo } = storeToRefs(useCaseStore())
const { getCaseInfo } = useCaseStore()
const { emailValid, creditCodeValid } = useValidate()
const router = useRouter()
const rules = {
  caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
  courtName: [{ required: true, message: '请输入受理法院', trigger: 'blur' }],
  procedure: [{ required: true, message: '请选择破产程序', trigger: 'blur' }],
  declareEndDate: [{ required: true, message: '请选择债权申报截止日期', trigger: 'blur' }],
  managerDecisionFileFileNumber: [{ required: true, message: '请输入指定破产管理人决定文书号', trigger: 'blur' }],
  liquidationOrderFileFileNumber: [{ required: true, message: '请输入受理破产清算裁定文书号', trigger: 'blur' }],
  firstMeetingDate: [{ required: true, message: '请选择第一次债权人会议时间', trigger: 'blur' }],
  declareStartDate: [{ required: true, message: '请选择债权申报开始日期', trigger: 'chane' }],
  firstMeetingAddress: [{ required: true, message: '请输入会议地址', trigger: 'blur' }],
  custodianPhone: [
    { required: true, message: '请输入管理人联系方式', trigger: 'blur' },
  ],
  custodianEmail: [
    { required: true, message: '请输入团队邮箱', trigger: 'blur' },
    { validator: emailValid, trigger: 'blur' },
  ],
  custodianAddress: [{ required: true, message: '请输入管理人地址', trigger: 'blur' }],
  notice: [{ required: true, message: '请输入公告说明', trigger: 'blur' }],
  declareAddress: [{ required: true, message: '请输入申报地点', trigger: 'blur' }],
  debtorCompanyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  socialCreditCode: [
    { required: true, message: '请输入企业信用代码', trigger: 'blur' },
    { validator: creditCodeValid, trigger: 'blur' },
  ],
}
const formRef = ref(null)
const isDisabledAlways = ref(false)
// 文件回显
const inFileList = reactive({
  managerDecisionFile: [],
  liquidationOrderFile: [],
})
const loading = ref(false)
// // 文件上传进度
const progress = reactive({
  manager: 0,
  liquidation: 0,
})

const form = reactive({})
const columns = ref([
  {
    label: '案件名称',
    prop: 'caseName',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit || isDisabledAlways,
      placeholder: '请输入案件名称',
    },
  },
  {
    label: '受理法院',
    prop: 'courtName',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入受理法院',
    },
  },
  {
    label: '破产程序',
    prop: 'procedure',
    el: 'ElSelect',
    options: 'bankruptProgram',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请选择破产程序',
    },
  },
  {
    label: '指定破产管理人决定书',
    prop: 'managerDecisionFileFileNumber',
  },
  {
    label: '第一次债权人会议时间',
    prop: 'firstMeetingDate',
    el: 'ElDatePicker',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      type: 'datetime',
      placeholder: '请选择第一次债权人会议时间',
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    label: '债权申报开始日期',
    prop: 'declareStartDate',
    el: 'ElDatePicker',
    elAttrs: {
      disabled: caseInfo.value.isEdit || isDisabledAlways,
      type: 'date',
      placeholder: '请选择债权申报开始日期',
      valueFormat: 'YYYY-MM-DD',
      pickerOptions: { disabledDate: declareStartDateDisabled },
    },
  },
  {
    label: '受理破产清算裁定书',
    prop: 'liquidationOrderFileFileNumber',
  },
  {
    label: '第一次债权会议地址',
    prop: 'firstMeetingAddress',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入会议地址',
      maxlength: 50,
      showWordLimit: true,
    },
  },
  {
    label: '债权申报截止日期',
    prop: 'declareEndDate',
    el: 'ElDatePicker',
    elAttrs: {
      disabled: caseInfo.value.isEdit || isDisabledAlways,
      type: 'date',
      placeholder: '请选择债权申报截止日期',
      valueFormat: 'YYYY-MM-DD',
      pickerOptions: { disabledDate: declareEndDateDisabled },
    },
  },
  {
    label: '管理人联系方式',
    prop: 'custodianPhone',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入管理人联系方式',
      maxlength: 50,
      showWordLimit: true,
    },
  },
  {
    label: '管理人地址',
    prop: 'custodianAddress',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入管理人地址',
      maxlength: 50,
      showWordLimit: true,
    },
  },
  {
    label: '团队邮箱',
    prop: 'custodianEmail',
    el: 'ElInput',
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入团队邮箱',
      maxlength: 50,
      showWordLimit: true,
    },
  },
  {
    label: '公告说明',
    prop: 'notice',
  },
  {
    label: '申报地点',
    prop: 'declareAddress',
    el: 'ElInput',
    cols: 24,
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      autosize: { minRows: 4 },
      type: 'textarea',
      placeholder: '请输入申报地点 . . .',
      maxlength: 5000,
      showWordLimit: true,
    },
  },
  {
    label: '企业名称',
    prop: 'debtorCompanyName',
    el: 'ElInput',
    cols: 12,
    elAttrs: {
      disabled: caseInfo.value.isEdit || isDisabledAlways,
      placeholder: '请输入企业名称',
      maxlength: 50,
      showWordLimit: true,
    },
  },
  {
    label: '企业信用代码',
    prop: 'socialCreditCode',
    el: 'ElInput',
    cols: 12,
    elAttrs: {
      disabled: caseInfo.value.isEdit,
      placeholder: '请输入企业信用代码',
    },
  },
])
// 获取案件详情
getDetail()
async function getDetail() {
  try {
    const res = await getCaseDetailApi(caseInfo.value.projectId)
    if (res.success) {
      Object.assign(form, res.data)
      isDisabledAlways.value = !!form.announcementPdf
      if (form.managerDecisionFile) {
        if (form.managerDecisionFile.fileName) {
          inFileList.managerDecisionFile[0] = {
            fileName: form.managerDecisionFile.fileName,
            filePath: form.managerDecisionFile.filePath,
          }
        }
        form['managerDecisionFileFileNumber'] = form.managerDecisionFile.fileNumber
      } else {
        form.managerDecisionFile = {}
      }
      if (form.liquidationOrderFile) {
        if (form.liquidationOrderFile.fileName) {
          inFileList.liquidationOrderFile[0] = {
            fileName: form.liquidationOrderFile.fileName,
            filePath: form.liquidationOrderFile.filePath,
          }
        }
        form['liquidationOrderFileFileNumber'] = form.liquidationOrderFile.fileNumber
      } else {
        form.liquidationOrderFile = {}
      }
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
// 提交案件信息
async function onSave() {
  try {
    loading.value = true
    const validate = await formRef.value.validate()
    if (!validate) return ElMessage.warning('请完善案件信息！')

    const { managerDecisionFileFileNumber, liquidationOrderFileFileNumber, ...params } = form
    if (inFileList.managerDecisionFile.length === 0) {
      ElMessage.warning('请上传指定破产管理人决定书')
      return false
    }
    if (inFileList.liquidationOrderFile.length === 0) {
      ElMessage.warning('请上传受理批产清算裁定书')
      return false
    }
    // 破产管理人决定书信息
    params.managerDecisionFile.fileName = inFileList.managerDecisionFile[0]['fileName']
    params.managerDecisionFile.filePath = inFileList.managerDecisionFile[0]['filePath']
    params.managerDecisionFile.fileNumber = managerDecisionFileFileNumber
    // 破产清算裁定书信息
    params.liquidationOrderFile.fileName = inFileList.liquidationOrderFile[0]['fileName']
    params.liquidationOrderFile.filePath = inFileList.liquidationOrderFile[0]['filePath']
    params.liquidationOrderFile.fileNumber = liquidationOrderFileFileNumber

    const res = await postEditCaseApi(params)
    if (res.success) {
      ElMessage.success('操作成功！')
      getCaseInfo(caseInfo.value.projectId)
      getDetail()
    } else {
      console.error(res)
      ElMessage.error('保存失败，请重试！')
    }
  } catch (error) {
    console.error(error)
    const keys = Object.keys(error)
    const msg = keys.length && Object.prototype.hasOwnProperty.call(form, keys[0]) ? ElMessage.error(error[keys[0]][0]['message']) : error.message
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
// 删除
function onDelObsFile(flag) {
  if (flag === 'manager') {
    inFileList.managerDecisionFile = []
    progress.manager = 0
    form.managerDecisionFileFileNumber = ''
  } else if (flag === 'liquidation') {
    inFileList.liquidationOrderFile = []
    progress.liquidation = 0
    form.liquidationOrderFileFileNumber = ''
  }
}
function onReturnFile({ filePath, fileName }, flag) {
  if (flag === 'manager') {
    progress.manager = 0
    inFileList['managerDecisionFile'] = [{ filePath, fileName }]
    form.managerDecisionFileFileNumber = fileName.includes('.') ? fileName.slice(0, fileName.lastIndexOf('.')) : fileName
  } else if (flag === 'liquidation') {
    progress.liquidation = 0
    inFileList['liquidationOrderFile'] = [{ filePath, fileName }]
    form.liquidationOrderFileFileNumber = fileName.includes('.') ? fileName.slice(0, fileName.lastIndexOf('.')) : fileName
  }
}
function onDownload(key) {
  const { filePath, fileName } = inFileList[key][0]
  obsFileDownload(filePath, fileName)
}
function onPreviewBulletin(path) {
  window.open(import.meta.env.VITE_OBS_URL + path)
}
function onDownloadBulletin(path, title, time) {
  obsFileDownload(path, title + useDateFormat(time, ' YYYY年MM月DD日') + '.pdf')
}
// 债权申报开始日期不能晚于结束日期
function declareStartDateDisabled(date) {
  const cur = Date.now() - 24 * 60 * 60 * 1000
  const start = new Date(date).getTime()
  if (form.declareEndDate) {
    const end = new Date(form.declareEndDate).getTime()
    return start >= end || start < cur
  } else {
    return start < cur
  }
}
// 债权申报截止日期不能早于开始日期
function declareEndDateDisabled(date) {
  const cur = Date.now() - 24 * 60 * 60 * 1000
  const end = new Date(date).getTime()
  if (form.declareStartDate) {
    const start = new Date(form.declareStartDate).getTime()
    return start >= end
  } else {
    return end < cur
  }
}
// 获取每个状态下的债权数量
async function fetchNumApi() {
  try {
    loading.value = true
    const res = await creditorFindNumApi({
      projectId: caseInfo.value.projectId,
      userId: useAppStore().userInfo.userId,
    })
    if (res.success) {
      const { total, finished } = res.data.reduce((acc, cur) => {
        if (cur.status === null) {
          acc.total = cur.total
        }
        if (cur.status === 9) {
          acc.finished = cur.total
        }
        return acc
      }, { total: 0, finished: 0 })
      if (total === finished) {
        onChangeStaues()
      } else {
        ElMessageBox.confirm('债权认定还未结束，确认是否结案?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(confirm => {
          if (confirm === 'confirm') onChangeStaues()
        })
      }
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
// 结案
async function onChangeStaues() {
  try {
    loading.value = true
    const params = { id: caseInfo.value.id, status: '9' }
    const res = await postChangeStatusCaseApi(params)
    if (res.success) {
      ElMessage.success('操作成功！')
      router.push('/caseManage')
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
// 删除
async function onChangeStauesDel() {
  try {
    loading.value = true
    const params = { id: caseInfo.value.id, status: '3' }
    const res = await postChangeStatusCaseApi(params)
    if (res.success) {
      ElMessage.success('操作成功！')
      router.push('/caseManage')
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>
