<template>
  <div class="case_edit_info">
    <el-form ref="subFormRef" label-position="top" :model="subForm" :rules="rules" scroll-to-error>
      <el-card class="card_box">
        <h3 class="card_title">案件信息</h3>
        <el-row :gutter="20">
          <el-col :span="colSpan">
            <el-form-item label="案件名称" prop="caseName">
              <el-input v-model="subForm.caseName" :disabled="disabled || !!announcementPdf" placeholder="请输入案件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="受理法院" prop="courtName">
              <el-input v-model="subForm.courtName" :disabled="disabled" placeholder="请输入受理法院" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="破产程序" prop="procedure">
              <el-select v-model="subForm.procedure" :disabled="disabled" placeholder="请选择破产程序">
                <el-option v-for="v in dict.bankruptProgram" :value="v.value" :label="v.label" :key="v.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="指定破产管理人决定书" prop="managerDecisionFileFileNumber" class="file_number">
              <span v-if="inFileList.managerDecisionFile[0]" :style="{ 'grid-template-columns': disabled ? '1fr 30px': '1fr 30px 30px' }" class="file_number_file">
                <i :title="inFileList.managerDecisionFile[0]['fileName']" class="file_number_file_name">{{ inFileList.managerDecisionFile[0]['fileName'] }}</i>
                <el-icon class="cursor-pointer" @click="onDownload('managerDecisionFile')" title="下载">
                  <IconEpDownload />
                </el-icon>
                <el-popover v-if="!disabled" placement="top">
                  <p>确定删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" @click="onDelManager">确定</el-button>
                  </div>
                  <template #reference>
                    <el-icon color="red" ><IconEpDelete /></el-icon>
                  </template>
                </el-popover>
              </span>
              <HuaweiObsUpload
                v-else-if="!inFileList.managerDecisionFile[0] && !disabled"
                :show-file-list="false"
                :limit="1"
                :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
                :in-file-list="inFileList.managerDecisionFile"
                class="file_number_upload"
                system-type="dept"
                temp-file="tempFile"
                @getPercent="$event => loading.manager = Number($event)"
                @returnFile="onReturnFileManager">
                <el-progress v-if="loading.manager > 0" :percentage="loading.manager" :format="$event => $event === 100 ? '99%' : `${$event}%`" color="#67c23a" style="width: 200px;"></el-progress>
                <span style="font-size: 12px;" v-else>上传文件</span>
              </HuaweiObsUpload>
              <el-input v-model="subForm.managerDecisionFileFileNumber" :disabled="disabled" placeholder="请输入决定书文号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="第一次债权人会议时间" prop="firstMeetingDate">
              <el-date-picker v-model="subForm.firstMeetingDate" :disabled="disabled" type="datetime" placeholder="请选择第一次债权人会议时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="债权申报开始日期" prop="declareStartDate">
              <el-date-picker v-model="subForm.declareStartDate" :disabled="disabled || !!announcementPdf" :picker-options="{ disabledDate: declareStartDateDisabled }" type="date" placeholder="请选择债权申报开始日期" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="受理破产清算裁定书" prop="liquidationOrderFileFileNumber" class="file_number">
              <span v-if="inFileList.liquidationOrderFile[0]" :style="{ 'grid-template-columns': disabled ? '1fr 30px': '1fr 30px 30px' }" class="file_number_file">
                <i :title="inFileList.liquidationOrderFile[0]['fileName']" class="file_number_file_name">{{ inFileList.liquidationOrderFile[0]['fileName'] }}</i>
                <el-icon class="cursor-pointer" title="下载" @click="onDownload('liquidationOrderFile')">
                  <IconEpDownload/>
                </el-icon>
                <el-popover v-if="!disabled" placement="top">
                  <p>确定删除？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" @click="onDelLiquidation">确定</el-button>
                  </div>
                  <template #reference>
                    <el-icon color="red" ><IconEpDelete /></el-icon>
                  </template>
                </el-popover>
              </span>
              <HuaweiObsUpload
                v-else-if="!inFileList.liquidationOrderFile[0] && !disabled"
                :show-file-list="false"
                :limit="1"
                :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
                :in-file-list="inFileList.liquidationOrderFile"
                class="file_number_upload"
                temp-file="tempFile"
                system-type="dept"
                @getPercent="$event => loading.liquidation = Number($event)"
                @returnFile="onReturnFileLiquidation">
                <el-progress v-if="loading.liquidation > 0" :percentage="loading.liquidation" :format="$event => $event === 100 ? '99%' : `${$event}%`" color="#67c23a" style="width: 200px;"></el-progress>
                <span style="font-size: 12px;" v-else>上传文件</span>
              </HuaweiObsUpload>
              <el-input v-model="subForm.liquidationOrderFileFileNumber" :disabled="disabled" placeholder="请输入裁定书文号" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="第一次债权会议地址" prop="firstMeetingAddress">
              <el-input v-model="subForm.firstMeetingAddress" :disabled="disabled" placeholder="请输入会议地址" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="债权申报截止日期" prop="declareEndDate">
              <el-date-picker v-model="subForm.declareEndDate" :disabled="disabled || !!announcementPdf" :picker-options="{ disabledDate: declareEndDateDisabled }" type="date" placeholder="请选择债权申报截止日期" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="管理人联系方式" prop="custodianPhone">
              <el-input v-model="subForm.custodianPhone" :disabled="disabled" maxlength="50" placeholder="请输入管理人联系方式" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="管理人地址" prop="custodianAddress">
              <el-input v-model="subForm.custodianAddress" :disabled="disabled" placeholder="请输入管理人地址" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="团队邮箱" prop="custodianEmail">
              <el-input v-model="subForm.custodianEmail" :disabled="disabled" maxlength="50" placeholder="请输入团队邮箱" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告说明" prop="notice">
              <template #label >
                <span>公告说明</span>
                <el-button v-if="subForm.announcementPng && subForm.announcementPng.filePath" class="ml-5" size="small" type="primary" @click="onPreviewBulletin(subForm.announcementPng.filePath)" >
                  <template #icon>
                    <IconEpView />
                  </template>
                  公告预览
                </el-button>
                <el-button v-if="subForm.announcementPdf && subForm.announcementPdf.filePath" class="ml-5" size="small" type="primary" @click="onDownloadBulletin(subForm.announcementPdf.filePath, subForm.announcementPdf.fileName, subForm.announcementPdf.createTime)" >
                  <template #icon>
                    <IconEpDownload />
                  </template>
                  公告下载
                </el-button>
              </template>
              <div style="border: 1px solid #dcdfe6; border-radius: 8px; padding: 12px; width: 100%; max-height: 300px; overflow: hidden auto; background: #f5f7fa;" v-html="subForm.notice" ></div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申报地点" prop="declareAddress">
              <el-input :disabled="disabled" :autosize="{ minRows: 4 }" v-model="subForm.declareAddress" type="textarea" placeholder="请输入申报地点 . . ." maxlength="5000" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="card_box">
        <h3 class="card_title">债务人信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="debtorCompanyName">
              <el-input v-model="subForm.debtorCompanyName" :disabled="disabled || !!announcementPdf" placeholder="请输入企业名称" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业信用代码" prop="socialCreditCode">
              <el-input v-model="subForm.socialCreditCode" :disabled="disabled" placeholder="请输入企业信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <footer v-if="!disabled" class="case_info_btn">
      <el-button @click="$router.back()">取 消</el-button>
      <el-button v-loading="subLoading" type="primary" @click="onSave()">{{ subForm.createUser ? '保 存' : '受理案件并保存' }}</el-button>
      <el-popover
        v-loading="subLoading"
        v-if="subForm.createUser"
        placement="bottom-start"
        trigger="click">
        <ul class="case_info_btn_more_list">
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
          <span class="case_info_btn_more">
            更多
            <el-icon><IconEpArrowDown /></el-icon>
          </span>
        </template>
      </el-popover>
    </footer>
  </div>
</template>

<script>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
export default {
  props: {
    // 当前案件主要信息
    case: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { emailValid, creditCodeValid } = useValidate()
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
    function onPreviewBulletin(path) {
      window.open(import.meta.env.VITE_OBS_URL + path)
    }
    function onDownloadBulletin(path, title, time) {
      obsFileDownload(path, title + useDateFormat(time, ' YYYY年MM月DD日').value + '.pdf')
    }
    return { rules, onPreviewBulletin, onDownloadBulletin }
  },
  data() {
    return {
      subLoading: false,
      colSpan: 8, // 每个表单项占据的24栅格列数
      subForm: {},
      announcementPdf: null,
      // 文件回显
      inFileList: {
        managerDecisionFile: [],
        liquidationOrderFile: [],
      },
      dict: {
        bankruptCaseType: [], // 案件阶段选项
        bankruptProgram: [], // 破产程序
      },
      // 文件上传进度
      loading: {
        liquidation: 0,
        manager: 0,
      },
    }
  },
  computed: {
    // 进行中的案件，和后台返回的权限字段 edit 来判断案件信息是否可修改
    disabled() {
      return !(Number(this.case.status) === 2 && (this.case.edit === 'true' || !this.case.createUser))
    },
  },
  created() {
    this.getDetail()
    this.getDict()
  },
  methods: {
    onReturnFileManager({ filePath, fileName }) {
      this.loading.manager = 0
      this.inFileList['managerDecisionFile'] = [{ filePath, fileName }]
      this.subForm.managerDecisionFileFileNumber = fileName.includes('.') ? fileName.slice(0, fileName.lastIndexOf('.')) : fileName
    },
    onDelManager() {
      this.inFileList.managerDecisionFile = []
      this.loading.manager = 0
      this.subForm.managerDecisionFileFileNumber = ''
    },
    onReturnFileLiquidation({ filePath, fileName }) {
      this.loading.liquidation = 0
      this.inFileList['liquidationOrderFile'] = [{ filePath, fileName }]
      this.subForm.liquidationOrderFileFileNumber = fileName.includes('.') ? fileName.slice(0, fileName.lastIndexOf('.')) : fileName
    },
    onDelLiquidation() {
      this.inFileList.liquidationOrderFile = []
      this.loading.liquidation = 0
      this.subForm.liquidationOrderFileFileNumber = ''
    },
    onDownload(key) {
      const { filePath, fileName } = this.inFileList[key][0]
      obsFileDownload(filePath, fileName)
    },
    // 债权申报开始日期不能晚于结束日期
    declareStartDateDisabled(date) {
      const cur = Date.now() - 24 * 60 * 60 * 1000
      const start = new Date(date).getTime()
      if (this.subForm.declareEndDate) {
        const end = new Date(this.subForm.declareEndDate).getTime()
        return start >= end || start < cur
      } else {
        return start < cur
      }
    },
    // 债权申报截止日期不能早于开始日期
    declareEndDateDisabled(date) {
      const cur = Date.now() - 24 * 60 * 60 * 1000
      const end = new Date(date).getTime()
      if (this.subForm.declareStartDate) {
        const start = new Date(this.subForm.declareStartDate).getTime()
        return start >= end
      } else {
        return end < cur
      }
    },
    // 获取字典 111
    async getDict() {
      try {
        const dictKey = ['bankruptCaseType', 'bankruptProgram']
        const resList = await Promise.all(dictKey.map(code => getDictApi({ code })))
        resList.forEach((res, i) => {
          if (res.success) {
            this.dict[dictKey[i]] = res.data.map(v => ({ value: v.id, label: v.dictLabel }))
          } else {
            ElMessage.error(res.msg)
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    // 获取详情 111
    async getDetail() {
      try {
        const res = await getCaseDetailApi(this.case.projectId)
        if (res.success) {
          this.subForm = res.data
          if (!this.case.createUser) {
            this.$emit('updateCreateUser', this.subForm.createUser)
          }
          this.announcementPdf = this.subForm.announcementPdf
          if (this.subForm.managerDecisionFile) {
            if (this.subForm.managerDecisionFile.fileName) {
              this.inFileList.managerDecisionFile[0] = {
                fileName: this.subForm.managerDecisionFile.fileName,
                filePath: this.subForm.managerDecisionFile.filePath,
              }
            }
            this.subForm['managerDecisionFileFileNumber'] = this.subForm.managerDecisionFile.fileNumber
          } else {
            this.subForm.managerDecisionFile = {}
          }
          if (this.subForm.liquidationOrderFile) {
            if (this.subForm.liquidationOrderFile.fileName) {
              this.inFileList.liquidationOrderFile[0] = {
                fileName: this.subForm.liquidationOrderFile.fileName,
                filePath: this.subForm.liquidationOrderFile.filePath,
              }
            }
            this.subForm['liquidationOrderFileFileNumber'] = this.subForm.liquidationOrderFile.fileNumber
          } else {
            this.subForm.liquidationOrderFile = {}
          }
          this.$nextTick(this.$refs.subFormRef.clearValidate)
          this.$emit('debtorCompanyName', this.subForm.debtorCompanyName)
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 结案
    async onChangeStaues() {
      try {
        this.subLoading = true
        const params = { id: this.case.id, status: 9 }
        const res = await postChangeStatusCaseApi(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.$router.push('/caseClosed')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.subLoading = false
      }
    },
    // 获取每个状态下的债权数量
    async fetchNumApi() {
      try {
        this.subLoading = true
        const res = await creditorFindNumApi({
          projectId: this.case.projectId,
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
            this.onChangeStaues()
          } else {
            ElMessageBox.confirm('债权认定还未结束，确认是否结案?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(confirm => {
              if (confirm === 'confirm') this.onChangeStaues()
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
        this.subLoading = false
      }
    },
    // 删除
    async onChangeStauesDel() {
      try {
        this.subLoading = true
        const params = { id: this.case.id, status: 3 }
        const res = await postChangeStatusCaseApi(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.$router.push('/caseDeleted')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.subLoading = false
      }
    },
    // 提交案件信息
    async onSave() {
      try {
        this.subLoading = true
        const validate = await this.$refs.subFormRef.validate()
        if (!validate) return ElMessage.warning('请完善案件信息！')

        const { managerDecisionFileFileNumber, liquidationOrderFileFileNumber, ...params } = this.subForm
        if (this.inFileList.managerDecisionFile.length === 0) {
          ElMessage.warning('请上传指定破产管理人决定书')
          return false
        }
        if (this.inFileList.liquidationOrderFile.length === 0) {
          ElMessage.warning('请上传受理批产清算裁定书')
          return false
        }
        // 破产管理人决定书信息
        params.managerDecisionFile.fileName = this.inFileList.managerDecisionFile[0]['fileName']
        params.managerDecisionFile.filePath = this.inFileList.managerDecisionFile[0]['filePath']
        params.managerDecisionFile.fileNumber = managerDecisionFileFileNumber
        // 破产清算裁定书信息
        params.liquidationOrderFile.fileName = this.inFileList.liquidationOrderFile[0]['fileName']
        params.liquidationOrderFile.filePath = this.inFileList.liquidationOrderFile[0]['filePath']
        params.liquidationOrderFile.fileNumber = liquidationOrderFileFileNumber

        const res = await postEditCaseApi(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.getDetail()
        } else {
          console.error(res)
          ElMessage.error('保存失败，请重试！')
        }
      } catch (error) {
        console.error(error)
        const keys = Object.keys(error)
        const msg = keys.length && Object.prototype.hasOwnProperty.call(this.subForm, keys[0]) ? ElMessage.error(error[keys[0]][0]['message']) : error.message
        ElMessage.error(msg)
      } finally {
        this.subLoading = false
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-select, .el-date-editor) {
  width: 100% !important;
}
.case_edit_info {
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 20px;
}
.card_box {
  margin-bottom: 20px;
}
.card_title {
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}
.card_title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  background: #c1b39f;
  margin-right: 5px;
}
.file_number {
  position: relative;
}
.file_number_upload {
  position: absolute;
  right: 0;
  top: -34px;
  cursor: pointer;
  color: #a69480;
  text-align: right;
}
.file_number_upload:hover {
  text-decoration: underline;
}
.file_number_upload::before {
  content: '*';
  position: absolute;
  right: 3.5em;
  top: 0.1em;
  color: red;
}
.file_number_file {
  width: 100%;
  gap: 10px;
  position: absolute;
  right: 0;
  top: -36px;
  display: grid;
  text-align: right;
  align-items: center;
  justify-items: end;
}
.file_number_file_name {
  font-size: 12px;
  color: #c1b39f;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
  padding-left: 40%;
}
.el-icon-download {
  font-size: 12px;
  color: #c1b39f;
  cursor: pointer;
}
.case_info_btn {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  box-sizing: border-box;
  font-size: 14px;
}
.case_info_btn_more {
  cursor: pointer;
  color: #606266;
}
.case_info_btn_more_list {
  line-height: 2em;
  text-align: center;
  color: #606266;
  cursor: pointer;
}
</style>
