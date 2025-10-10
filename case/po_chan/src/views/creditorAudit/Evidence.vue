<template>
  <div class="evidence">
    <div v-for="item in list" :key="item.fileName" class="wrap">
      <p class="title">
        {{ item.fileName }}
      </p>
      <p v-for="v in item.files" :key="v.fileName" class="file">
        <span
          v-if="v.filePath && item.fileName !== '证据材料'"
          @click="onOpen(v)"
        >
          <figure>
            <img :src="icon[v.type]" />
            <figcaption>{{ v.fileName }}</figcaption>
          </figure>
          <p v-if="item.fileName === '其他材料' && v.customParentFolderName">
            <span style="color: #9999">证据名称：</span>
            {{ v.customParentFolderName }}
          </p>
          <p v-if="item.fileName === '其他材料' && v.remarks">
            <span style="color: #9999">证据说明：</span>
            {{ v.remarks }}
          </p>
        </span>
        <HuaweiObsUpload
          v-if="!v.filePath && creditor.canReviewer"
          ref="uploadRef"
          :show-file-list="false"
          class="file_number_upload"
          system-type="dept"
          temp-file="tempFile"
          @returnFile="
            ({ filePath, fileName }) =>
              uploadFile({ filePath, fileName }, item, v.fileName)
          "
        >
          <span class="upload">
            <el-icon><IconEpUpload /></el-icon>
            上传{{ v.fileName }}
          </span>
        </HuaweiObsUpload>
        <template v-if="v.filePath && item.fileName !== '证据材料'">
          <span
            class="btn"
            @click="download(v.filePath, v.fileName)"
          >下载</span
          >
          <!-- <span v-if="creditor.canReviewer" class="btn" @click="onDelete(v.id)" >删除</span> -->
        </template>
      </p>
      <template v-if="creditor.canReviewer">
        <span v-if="item.fileName === '其他材料'" class="upload" style="cursor: pointer;" @click="otherDialog = true; otherFormFileList = []; otherForm.folderName = item.fileName"><el-icon><IconEpUpload /></el-icon> 上传附件 </span>
        <p
          v-if="item.fileName === '证据材料'"
          class="evidence_view"
          @click="onView()"
        >
          查看证据
        </p>
      </template>
    </div>
    <el-dialog v-model="evidenceVisible" top="10vh" title="证据属性" width="450px">
      <div v-for="v in evidenceList" :Key="v.id">
        <ul class="box_content_list">
          <li style="display: flex; flex-flow: row-reverse">
            <el-button
              size="mini"
              type="primary"
              @click="onEdit(v)"
            >修 改</el-button
            >
          </li>
          <li>
            <span class="label">证据名称：</span>
            <span class="number">{{ v.evidenceName }}</span>
          </li>
          <li>
            <span class="label">证据页数：</span>
            <span class="number">{{ v.evidenceNum }}</span>
          </li>
          <li>
            <span class="label">有无原件：</span>
            <span class="number">{{ v.isMasterCopy == 0 ? "有" : "无" }}</span>
          </li>
          <li>
            <span class="label">证据分类：</span>
            <span class="number">{{ v.evidenceTypeName }}</span>
          </li>
          <li>
            <span class="label">证明对象：</span>
            <span class="number">{{ v.evidenceObject }}</span>
          </li>
          <li>
            <span class="label">证明目的：</span>
            <span class="number">{{ v.evdenceGoal }}</span>
          </li>
          <li>
            <span class="label">关联申报金额：</span>
            <span class="number">{{ formatCNY(v.total) }}</span>
          </li>
          <li>
            <span class="label">证据列表：</span>
            <span></span>
          </li>
          <li
            v-for="file in v.fileList"
            :key="file.id"
            class="filename"
            @click="download(file.filePath, file.fileName)"
          >
            {{ file.fileName }}
          </li>
        </ul>
        <p class="divider">
          <span class="delete" @click="onDel(v.id)">
            <el-icon><IconEpDelete /></el-icon>
          </span>
        </p>
      </div>
      <p style="display: flex; flex-flow: row-reverse">
        <el-button
          size="mini"
          type="primary"
          @click="
            evidenceDialog = true;
            formFileList = [];
            getMoneyDetaiList();
          "
        >添加证据</el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      v-model="evidenceDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加证据"
      width="450px"
      top="10vh"
      @close="onClose">
      <el-form ref="formRef" :model="form" :rules="rules" size="mini">
        <el-form-item label="证据名称" prop="evidenceName">
          <el-input v-model="form.evidenceName" placeholder="请输入证据名称" />
        </el-form-item>
        <el-form-item label="证据页数" prop="evidenceNum">
          <el-input-number v-model="form.evidenceNum" :step="1" :min="0" />
        </el-form-item>
        <el-form-item label="有无原件" prop="isMasterCopy">
          <el-select v-model="form.isMasterCopy">
            <el-option :value="0" label="有"></el-option>
            <el-option :value="1" label="无"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证据分类" prop="evidenceType">
          <el-select v-model="form.evidenceType">
            <el-option v-for="v in code" :label="v.label" :value="v.value" :key="v.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证明对象" prop="evidenceObject">
          <el-input
            v-model="form.evidenceObject"
            placeholder="请输入证明对象"
          />
        </el-form-item>
        <el-form-item label="证明目的" prop="evdenceGoal">
          <el-input
            v-model="form.evdenceGoal"
            :maxlength="200"
            :autosize="{ minRows: 4, maxRows: 8 }"
            show-word-limit
            type="textarea"
            placeholder="请输入证明目的"
          />
        </el-form-item>
        <el-form-item label="关联申报金额" prop="moneyId">
          <el-select v-model="form.moneyId">
            <el-option
              v-for="v in totalList"
              :value="v.value"
              :label="v.label"
              :key="v.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证据材料"></el-form-item>
        <HuaweiObsUpload
          v-if="evidenceDialog"
          :in-file-list="formFileList"
          temp-file="tempFile"
          system-type="dept"
          @returnFileList="returnFile"
        >
          <el-button size="mini" type="primary" >
            <el-icon><IconEpUpload /></el-icon>
            上传证据
          </el-button>
        </HuaweiObsUpload>
      </el-form>
      <div class="footer">
        <el-button size="mini" @click="evidenceDialog = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="onSave()"
        >保 存</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      v-model="otherDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加证据"
      top="10vh"
      width="450px"
      @close="onClose">
      <el-form ref="otherFormRef" :model="otherForm" :rules="rules" size="mini">
        <el-form-item label="证据名称" prop="evidenceName">
          <el-input v-model="otherForm.evidenceName" placeholder="请输入证据名称" />
        </el-form-item>
        <el-form-item label="证据说明" prop="remarks">
          <el-input v-model="otherForm.remarks" type="textarea" placeholder="请输入证据说明" />
        </el-form-item>
        <el-form-item label="证据材料"></el-form-item>
        <HuaweiObsUpload
          v-if="otherDialog"
          :in-file-list="otherFormFileList"
          temp-file="tempFile"
          system-type="dept"
          @returnFileList="returnOtherFile"
        >
          <el-button size="mini" type="primary" >
            <IconEpUpload />
            上传证据
          </el-button>
        </HuaweiObsUpload>
      </el-form>
      <div class="footer">
        <el-button size="mini" @click="otherDialog = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="onOtherSave()"
        >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import { FILE_SUFFIX, ICON } from '@/constant'
const rules = {
  evidenceName: [{ required: true, message: '请输入证据名称', trigger: 'blur' }],
}
export default {
  setup() {
    const { formatCNY } = useFormatMoney()
    const appStore = useAppStore()
    return { formatCNY, appStore }
  },
  props: {
    caseInfo: {
      type: Object,
      required: true,
    },
    creditor: {
      type: Object,
      required: true,
    },
    // 代理人身份
    agentType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: ICON,
      list: [],
      evidenceVisible: false,
      evidenceList: [],
      evidenceDialog: false,
      rules,
      totalList: [],
      formFileList: [],
      otherDialog: false,
      form: {
        evidenceName: '',
        evidenceNum: 0,
        isMasterCopy: 1,
        evidenceObject: '',
        evdenceGoal: '',
        moneyId: '',
        fileList: [],
        evidenceType: '',
      },
      otherForm: {
        evidenceName: '',
        remarks: '',
        fileList: [],
        folderName: '',
      },
      otherFormFileList: [],
      code: [],
    }
  },
  created() {
    this.fetchData()
    this.getCode()
  },
  methods: {
    async getCode() {
      try {
        const res = await getDictApi({ code: 'bankruptEvidenceType' })
        if (res.success) {
          this.code = res.data.map(v => ({ label: v.dictLabel, value: v.id }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    onClose() {
      this.form = {
        evidenceName: '',
        evidenceNum: 0,
        isMasterCopy: 1,
        evidenceObject: '',
        evdenceGoal: '',
        moneyId: '',
        fileList: [],
      }
    },
    generateUUID() {
      var d = new Date().getTime()
      if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now() // use high-precision timer if available
      }
      var uuid = 'xxxxxxxy-yxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function(c) {
          var r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )
      return uuid
    },
    onEdit(v) {
      this.getMoneyDetaiList()
      this.form = JSON.parse(JSON.stringify(v))
      this.formFileList = this.form.fileList.map(v => ({
        ...v,
        uid: this.generateUUID(),
      }))
      this.evidenceDialog = true
    },
    // 查询关联申报金额列表
    async getMoneyDetaiList() {
      try {
        const res = await getMoneyDetaiList(this.creditor.creditorId)
        if (res.success) {
          this.totalList = res.data.map((v, i) => ({
            value: v.moneyDetail.id,
            label: `【申报金额${i + 1}】 ${Number(v.moneyDetail.total).toFixed(
              2
            )}`,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    download(filePath, fileName) {
      obsFileDownload(filePath, fileName)
    },
    returnFile(fileList) {
      this.form.fileList = fileList
      this.formFileList = fileList
    },
    returnOtherFile(fileList) {
      this.otherForm.fileList = fileList
      this.otherFormFileList = fileList
    },
    // 编辑证据材料
    async onSave() {
      try {
        const validate = await this.$refs.formRef.validate()
        if (!validate) return false
        this.form.projectId = this.caseInfo.projectId
        this.form.creditorId = this.creditor.creditorId
        const customParentFolderName = this.code.find(v => v.value === this.form.evidenceType)
        if (customParentFolderName) {
          this.form.fileList = this.form.fileList.map(v => ({ ...v, customParentFolderName: customParentFolderName.label }))
        }
        const res = await evidenceUploadApi(this.form)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.evidenceDialog = false
          this.onView()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onOtherSave() {
      try {
        const validate = await this.$refs.otherFormRef.validate()
        if (!validate) return false
        const params = {
          projectId: this.caseInfo.projectId,
          userId: this.appStore.userInfo.userId,
          companyId: this.caseInfo.companyId,
          creditorId: this.creditor.creditorId,
          folderName: this.otherForm.folderName,
          evidenceName: this.otherForm.evidenceName,
          remarks: this.otherForm.remarks,
          fileList: this.otherForm.fileList.map(v => ({
            fileName: v.fileName,
            filePath: v.filePath,
            customParentFolderName: this.otherForm.evidenceName,
            remarks: this.otherForm.remarks,
          })),
        }
        const res = await evidenceAnnexApi(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.otherDialog = false
          this.fetchData()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 查看证据材料详情
    async onView() {
      this.evidenceVisible = true
      try {
        const res = await evidenceGetDetailApi(this.creditor.creditorId)
        if (res.success) {
          this.evidenceList = res.data.map(v => {
            const evidenceTypeName = this.code.find(i => i.value === v.evidenceType)
            if (evidenceTypeName) {
              v.evidenceTypeName = evidenceTypeName.label
            }
            return v
          })
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onDel(id) {
      try {
        const confirm = await ElMessageBox.confirm('确认删除？', '提示')
        if (!confirm) {
          return false
        }
        const res = await evidenceDelApi(id)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.onView()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onDelete(id) {
      try {
        const confirm = await ElMessageBox.confirm('确认删除？', '提示')
        if (!confirm) {
          return false
        }
        const res = await updateCaseFileStatueApi({ id, status: -3 })
        if (res.success) {
          ElMessage.success('操作成功！')
          this.fetchData()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async uploadFile({ filePath, fileName }, obj, name) {
      try {
        let params, api
        if (obj.fileName === '证据材料') {
          api = evidenceUploadApi
          params = {
            projectId: this.caseInfo.projectId,
            userId: this.appStore.userInfo.userId,
            companyId: this.caseInfo.companyId,
            creditorId: this.creditor.creditorId,
            fileList: [{ filePath, fileName }],
          }
        } else {
          api = evidenceAnnexApi
          params = {
            projectId: this.caseInfo.projectId,
            userId: this.appStore.userInfo.userId,
            companyId: this.caseInfo.companyId,
            creditorId: this.creditor.creditorId,
            folderName: obj.fileName,
            fileList: [{ filePath, fileName }],
          }
          if (obj.fileName !== '其他材料') {
            params.fileList = params.fileList.map(v => ({
              ...v,
              fileName: name + '.' + v.filePath.split('.')[1],
            }))
          }
        }
        const res = await api(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.fetchData()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async fetchData() {
      try {
        const res = await evidenceFindApi(this.creditor.creditorId)
        if (res.success) {
          // 代理人类型不存在时，不需要展示代理人资料、授权委托书
          if (!this.agentType) {
            res.data = res.data.filter(
              v => !['授权委托书', '代理人资料'].includes(v.fileName)
            )
          }
          this.list = res.data.map(v => {
            if (v.fileName === '代理人资料') {
              if (this.agentType === '律师') {
                if (!v.files) {
                  v.files = [{ fileName: '律师职业证' }, { fileName: '所函' }]
                } else if (Array.isArray(v.files) && v.files.length === 1) {
                  if (v.files[0].fileName.includes('律师职业证')) {
                    v.files.push({ fileName: '所函' })
                  }
                  if (v.files[0].fileName.includes('所函')) {
                    v.files.push({ fileName: '律师职业证' })
                  }
                }
              }
              if (this.agentType === '自然人') {
                if (!v.files) {
                  v.files = [
                    { fileName: '身份证复印件' },
                    { fileName: '社区证明' },
                  ]
                } else if (Array.isArray(v.files) && v.files.length === 1) {
                  if (v.files[0].fileName.includes('身份证复印件')) {
                    v.files.push({ fileName: '社区证明' })
                  }
                  if (v.files[0].fileName.includes('社区证明')) {
                    v.files.push({ fileName: '身份证复印件' })
                  }
                }
              }
            }

            const names = [
              '营业执照',
              '法定代表人(负责人)身份证明书',
              '劳动合同',
              '授权委托书',
              '债权人地址及联系方式确认书',
            ]
            if (
              names.includes(v.fileName) &&
              (!Array.isArray(v.files) || v.files.length === 0)
            ) {
              v.files = [{ filePath: '', fileName: v.fileName }]
            }

            if (v.fileName === '证据材料') {
              v.files = []
            }
            // 通过文件名后缀匹配对应的图标
            if (Array.isArray(v.files) && v.files.length > 0) {
              v.files = v.files.map(v => {
                if (v.filePath) {
                  const suffix = v.filePath.split('.')[1]
                  if (suffix) v.type = FILE_SUFFIX[suffix]
                }
                return v
              })
            } else {
              v.files = []
            }
            return v
          })
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    onOpen(file) {
      const imgs = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'pdf']
      const files = ['doc', 'docx']
      let testmsg = String(file.filePath).substring(
        String(file.filePath).lastIndexOf('.') + 1
      )
      testmsg = testmsg.toLowerCase()
      if (imgs.indexOf(testmsg) > -1) {
        window.open(import.meta.env.VITE_OBS_URL + file.filePath)
        return false
      }
      if (files.indexOf(testmsg) > -1) {
        if (this.appStore.userInfo.juUserId1) {
          window.open(
            location.origin +
              '/look/ntko/look.html?url=' +
              file.filePath +
              '&companyId=' +
              this.appStore.userInfo.sysCompany.companyId
          )
          return
        }
        window.open(
          location.origin +
            '/look/webOfficeZs/openReadOffice.html?obsUrl=' +
            import.meta.env.VITE_OBS_URL +
            file.filePath
        )
        return
      }
      ElMessage.warning('暂不支持该文件直接查看，建议下载！')
    },
  },
}
</script>

<style scoped>
.evidence {
  height: 100%;
  font-size: 14px;
  line-height: 2em;
  padding-top: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
.wrap {
  padding-bottom: 20px;
}
.wrap .title {
  color: #999;
}
.wrap .file {
  display: grid;
  grid-template-columns: 1fr 50px;
  color: #333;
  padding: 12px;
  box-sizing: border-box;
  cursor: pointer;
}
.wrap .file figure {
  display: grid;
  grid-template-columns: 20px 1fr;
  column-gap: 10px;
  align-items: center;
}
.wrap .file figure img {
  height: 20px;
}
.wrap .file .btn {
  color: #a69480;
}
.wrap .file:hover {
  background: #f4f4f4;
}
.wrap .upload {
  color: #8f693d;
}
.wrap .upload:hover {
  font-weight: bolder;
}
.wrap .evidence_view {
  color: #a69480;
  cursor: pointer;
  text-indent: 1em;
}
.wrap .evidence_view:hover {
  background: #f4f4f4;
}
.box_content_list li {
  display: flex;
  justify-content: space-between;
  line-height: 2.5em;
}
.box_content_list li .label {
  color: #999;
  white-space: nowrap;
}
.box_content_list li .number {
  color: #333;
}
.box_content_list .filename {
  color: #8f693d;
  cursor: pointer;
  text-indent: 1em;
}
.box_content_list .filename:hover {
  background: #f4f4f4;
}
.divider {
  border-bottom: 1px dashed #dcdfe6;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  padding: 12px 0;
}
.divider .delete {
  position: absolute;
  right: 20px;
  top: 5px;
  color: red;
  width: 2em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  border: 1px dashed #dcdfe6;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}
.divider .delete:hover {
  border-color: red;
}
:deep(.el-input-number,.el-select){
  width: 100% !important;
}
:deep(.el-dialog__body) {
  max-height: 600px;
  overflow-y: auto;
}
.footer {
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
