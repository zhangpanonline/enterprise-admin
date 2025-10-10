<template>
  <div class="body">
    <main class="main">
      <header class="header">
        <h1>
          债权申报登记表
        </h1>
        <div class="header_op">
          <el-button
            :disabled="[5].includes(Number(creditor.status))"
            type="waring"
            size="mini"
            @click="onReview(false)"
          >驳回形查</el-button
          >
          <el-button
            v-if="buttonAuth[AUDIT_BUTTON]"
            :disabled="[7, 2, 9].includes(Number(creditor.status))"
            type="primary"
            size="mini"
            @click="onReview(true)"
          >通过形查</el-button
          >
          <span
            v-show="caseInfo.edit"
            class="header_func delete"
            @click="onDelete()"
          >
            <el-icon><IconEpDelete /></el-icon>
            删除
          </span>
          <el-popover
            ref="popoverRef"
            placement="bottom-start"
            class="header_func"
            width="150"
            trigger="hover"
          >
            <div class="creditor__func__notice">
              <ul>
                <li @click="onDownload('confirm')">
                  <el-icon><IconEpDocument /></el-icon>
                  债权申报登记表
                </li>
                <li @click="onDownload('evidence')">
                  <el-icon><IconEpTickets /></el-icon>
                  生成证据清单
                </li>
              </ul>
            </div>
            <template #reference >
              <span v-if="creditor.canReviewer">
                <el-icon><IconEpDownload /></el-icon>
                下载
              </span>
            </template>
          </el-popover>
          <el-popover
            placement="bottom-start"
            width="150"
            class="header_func"
            trigger="hover"
          >
            <ul class="creditor__func__notice">
              <li @click="onMsg(2)">
                <el-icon><IconEpChatDotSquare /></el-icon>
                短信通知
              </li>
              <li @click="onMsg(1)">
                <el-icon><IconEpChatDotSquare /></el-icon>
                系统通知
              </li>
            </ul>
            <template #reference >
              <span v-if="creditor.canReviewer">
                <el-icon><IconEpPosition /></el-icon>
                发消息
              </span>
            </template>
          </el-popover>
          <span class="header_func" @click="closeWindow()">
            <el-icon><IconEpClose /></el-icon>
            关闭
          </span>
        </div>
      </header>
      <div class="content">
        <header class="content_header">
          <el-button-group>
            <el-button
              v-if="buttonAuth[TAB1]"
              :type="isForm ? 'primary' : 'default'"
              size="mini"
              @click="isForm = true"
            >债权申报表</el-button
            >
            <el-button
              v-if="buttonAuth[TAB2]"
              :type="!isForm ? 'primary' : 'default'"
              size="mini"
              @click="isForm = false"
            >证据材料</el-button
            >
          </el-button-group>
          <div v-if="isForm && creditor.canReviewer">
            <!-- <el-button v-if="isEdit === true" size="mini" @click="onCancel">取消</el-button> -->
            <!-- <el-button v-if="isEdit === true" size="mini" type="primary" @click="onSave">保存</el-button> -->
            <span
              v-if="isEdit === false"
              :class="{ content_header_edit: true, active: isEdit }"
              @click="isEdit = true"
            >
              <el-icon><IconEpEdit /></el-icon>
              编辑
            </span>
          </div>
          <span
            v-if="!isForm && creditor.canReviewer"
            class="content_header_edit"
            @click="onDownload('evidence')"
          >
            <el-icon><IconEpManagement /></el-icon>
            生成清单
          </span>
        </header>
        <div class="content_box">
          <!-- 债权申报表：单位、个人 -->
          <ReportCompany
            v-if="
              [
                'f2ec849da47d407ebb4201db8a59039e',
              ].includes(creditor.creditorType)
            "
            v-show="isForm"
            ref="reportCompanyRef"
            :is-edit="isEdit"
            @auditInfo="auditInfo = $event"
            @notEdit="isEdit = false"
          />
          <!-- 个人 -->
          <ReportPerson
            v-if="
              [
                'd041727271c04dacb0a30e1b2249a662'
              ].includes(creditor.creditorType)
            "
            v-show="isForm"
            ref="reportPersonRef"
            :is-edit="isEdit"
            @auditInfo="auditInfo = $event"
            @notEdit="isEdit = false"
          />
          <!-- 债权申报表：职工 -->
          <ReportWorker
            v-if="creditor.creditorType === 'd388331d86c14674bde67935c6cd4609'"
            v-show="isForm"
            ref="reportWorkerRef"
            :is-edit="isEdit"
            @auditInfo="auditInfo = $event"
            @notEdit="isEdit = false"
          />
          <!-- 证据材料 -->
          <Evidence
            v-if="!isForm"
            :case-info="caseInfo"
            :agent-type="auditInfo.agentType"
            :creditor="creditor"
          />
        </div>
      </div>
    </main>
    <aside class="aside">
      <header class="aside_header">
        <span
          v-if="buttonAuth[TAB3]"
          :class="{ active: tabKey === 'audit' }"
          @click="tabKey = 'audit'"
        >实质审查</span
        >
        <span
          v-if="buttonAuth[TAB4]"
          :class="{ active: tabKey === 'dynamic' }"
          style="position: relative;"
          @click="(tabKey = 'dynamic'), (showType = false)"
        >债权动态
          <div v-if="showType" class="borderType"></div>
        </span>
        <span
          v-if="buttonAuth[TAB5]"
          :class="{ active: tabKey === 'objection' }"
          @click="tabKey = 'objection'"
        >债权异议</span
        >
        <span
          v-if="buttonAuth[TAB6]"
          :class="{ active: tabKey === 'result' }"
          @click="tabKey = 'result'"
        >审查结果书</span
        >
      </header>
      <div class="aside_box">
        <!-- 债权审定 -->
        <Audit
          v-if="tabKey === 'audit'"
          :info="auditInfo"
          :creditor="creditor"
          @ok="onAudit"
        />
        <!-- 债权动态 -->
        <Dynamic
          v-if="tabKey === 'dynamic'"
          :case-info="caseInfo"
          :creditor="creditor"
        />
        <!-- 债权异议 -->
        <Objection
          v-if="tabKey === 'objection'"
          :case-info="caseInfo"
          :creditor="creditor"
        />
        <!-- 审查结果书 -->
        <Result
          v-if="tabKey === 'result'"
          :case-info="caseInfo"
          :creditor="creditor"
        />
      </div>
    </aside>
    <footer class="footer">
      Copyright ©2020 筑术云 版权所有
      <a
        href="https://www.zhushucloud.com"
        target="_blank"
      >陕ICP备19022882号</a
      >
    </footer>
    <Confirm
      ref="confirmRef"
      :info="auditInfo"
      :case-info="caseInfo"
      @ok="onConfirm"
    />
    <!-- 通知 -->
    <Notice ref="noticeRef" />
  </div>
</template>

<script>
import ReportCompany from './report/Company.vue'
import ReportPerson from './report/Person.vue'
import ReportWorker from './report/Worker.vue'
import Evidence from './Evidence.vue'
import Audit from './aside/Audit.vue'
import Dynamic from './aside/Dynamic.vue'
import Objection from './aside/Objection.vue'
import Result from './aside/Result.vue'
import Confirm from './confirm.vue'
import Notice from './Notice.vue'
import { CASE_EDIT_AUDIT, CASE_EDIT_AUDIT_UPDATE, AUDIT_BUTTON, TAB1, TAB2, TAB3, TAB4, TAB5, TAB6 } from '@/constant'
export default {
  setup() {
    const caseStore = useCaseStore()
    // 解决刷新页面按钮权限丢失问题
    caseStore.getCaseInfo(caseStore.caseInfo.projectId)
    const { buttonAuth } = useButtonAuth([TAB1, TAB2, TAB3, TAB4, TAB5, TAB6, AUDIT_BUTTON])
    return { buttonAuth, TAB1, TAB2, TAB3, TAB4, TAB5, TAB6, AUDIT_BUTTON }
  },
  components: {
    ReportCompany,
    ReportPerson,
    ReportWorker,
    Evidence,
    Audit,
    Dynamic,
    Objection,
    Result,
    Confirm,
    Notice,
  },
  data() {
    return {
      // 案件信息
      caseInfo: {},
      // 债权人信息
      creditor: {},
      // 债权申报表是否可编辑
      isEdit: false,
      // 当前为债权申报表还是证据材料
      isForm: true,
      // 右侧激活的tab  audit 审定、dynamic 动态 、objection 异议、result 结果书
      tabKey: 'audit',
      // 从债权详情里拿到债权审定相关信息
      auditInfo: {},
      showType: false,
    }
  },
  created() {
    this.getCacheData()
  },
  methods: {
    onCancel() {
      if (this.creditor.creditorType === 'f2ec849da47d407ebb4201db8a59039e') {
        this.$refs.reportCompanyRef.onCancel()
      } else if (this.creditor.creditorType === 'd041727271c04dacb0a30e1b2249a662') {
        this.$refs.reportPersonRef.onCancel()
      } else {
        this.$refs.reportWorkerRef.onCancel()
      }
    },
    onSave() {
      if (this.creditor.creditorType === 'f2ec849da47d407ebb4201db8a59039e') {
        this.$refs.reportCompanyRef.onSave()
      } else if (this.creditor.creditorType === 'd041727271c04dacb0a30e1b2249a662') {
        this.$refs.reportPersonRef.onSave()
      } else {
        this.$refs.reportWorkerRef.onSave()
      }
    },
    // 在当前页面获取最新的缓存信息，父子传参形式传递给子组件
    getCacheData() {
      const storage = JSON.parse(window.localStorage.getItem(CASE_EDIT_AUDIT))
      this.caseInfo = storage.case
      this.creditor = storage.creditor
      if (this.creditor.creditorName) {
        document.title = '案件管理 - ' + this.creditor.creditorName
      }
      this.setType()
    },
    async setType() {
      try {
        const params = {
          projectId: this.caseInfo.projectId,
          creditorId: this.creditor.creditorId,
          moneyDetailId: this.creditor.creditor,
        }
        const res = await reddotApi(params)
        if (res.data) {
          this.showType = true
        }
      } catch (err) {
        console.error(err)
      }
    },
    async onDelete() {
      try {
        const { creditorId, moneyDetailId, moneyNatureId } = this.creditor
        const confirm = await ElMessageBox.confirm('确认删除当前债权？', '提示', {
          type: 'warning',
        })
        if (confirm !== 'confirm') return false
        const res = await creditorDelPageApi({
          creditorId,
          moneyDetailId,
          moneyNatureId,
        })
        if (res.success) {
          window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'delete')
          ElMessageBox.confirm('点击确定关闭当前页面', '债权信息删除成功！', {
            type: 'success',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            closeOnHashChange: false,
            callback() {
              window.close()
            },
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
    async closeWindow() {
      if (this.isEdit) {
        const confirm = await ElMessageBox.confirm(
          '关闭后当前页面信息将不会保存！',
          '提示'
        )
        if (confirm !== 'confirm') return false
        window.close()
      } else {
        window.close()
      }
    },
    // 审查认定
    async onAudit() {
      if ([-1, 0].includes(Number(this.creditor.status))) return
      if ([2, 9].includes(Number(this.creditor.status))) {
        this.$refs.confirmRef.visible = true
        return
      }
      if (Number(this.creditor.status) === 7) {
        try {
          const res = await reviewingApi(this.creditor.creditorId)
          if (res.success) {
            this.creditor = { ...this.creditor, status: 2 }
            window.localStorage.setItem(
              CASE_EDIT_AUDIT,
              JSON.stringify({ case: this.caseInfo, creditor: this.creditor })
            )
            window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
            this.$refs.confirmRef.visible = true
          } else {
            console.error(res)
            ElMessage.error(res.msg)
          }
        } catch (error) {
          console.error(error)
          ElMessage.error(error.message)
        }
      }
    },
    async onDownload(flag) {
      try {
        let api, params, name
        if (flag === 'evidence') {
          api = generateEvidenceListApi
          params = this.creditor.creditorId
          name = '债权申报文件清单' + '.pdf'
        } else if (flag === 'confirm') {
          api = generateConfirmApi
          params = this.creditor
          name = '债权申报登记表' + '.pdf'
        } else {
          return false
        }
        this.$refs.popoverRef.showPopper = false
        const res = await api(params)
        if (res) {
          const blob = new Blob([res])
          const a = document.createElement('a')
          const url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = name
          a.click()
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 发送系统消息
    onMsg(sendType) {
      const params = {
        projectId: this.caseInfo.projectId,
        userId: useAppStore().userInfo.userId,
        sendType,
        noticeType: 1, // 通知类型，1：个人通知；2：系统公告；3：团队通知
        creditorIds: [this.creditor.creditorId],
      }
      this.$refs.noticeRef.params = params
      this.$refs.noticeRef.type = sendType === 2 ? 'msg' : 'sys'
      this.$refs.noticeRef.visible = true
      this.$refs.noticeRef.num = 1
    },
    // 债权认定成功
    onConfirm(moneyDetailId) {
      if (moneyDetailId) {
        this.creditor = { ...this.creditor, moneyDetailId }
        window.localStorage.setItem(
          CASE_EDIT_AUDIT,
          JSON.stringify({ case: this.caseInfo, creditor: this.creditor })
        )
      }
      window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
      if (this.creditor.creditorType === 'f2ec849da47d407ebb4201db8a59039e') {
        this.$refs.reportCompanyRef.getDetail()
      } else if (this.creditor.creditorType === 'd041727271c04dacb0a30e1b2249a662') {
        this.$refs.reportPersonRef.getDetail()
      } else {
        this.$refs.reportWorkerRef.getDetail()
      }
    },
    // pass => 驳回形审：5，通过形审：7
    async onReview(pass) {
      try {
        if (pass) {
          const confirm = await ElMessageBox.confirm(
            '确认通过形式审查？',
            '形式审查',
            {
              type: 'warning',
            }
          )
          if (confirm !== 'confirm') return false
          const res = await formalityReviewApi({
            pass,
            creditorId: this.creditor.creditorId,
          })
          if (res.success) {
            this.creditor = { ...this.creditor, status: 7 }
            window.localStorage.setItem(
              CASE_EDIT_AUDIT,
              JSON.stringify({ case: this.caseInfo, creditor: this.creditor })
            )
            window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
            ElMessage.success('操作成功！')
          } else {
            console.error(res)
            ElMessage.error(res.msg)
          }
        } else {
          ElMessageBox.prompt('请输入驳回原因', '驳回形查', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^(.|\r|\n){1,500}$/,
            closeOnHashChange: false,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            inputType: 'textarea',
            inputErrorMessage: '请输入驳回原因，最长500字！',
          }).then(async({ value }) => {
            const res = await formalityReviewApi({
              pass,
              creditorId: this.creditor.creditorId,
              rejectReason: value,
            })
            if (res.success) {
              this.creditor = { ...this.creditor, status: 5 }
              window.localStorage.setItem(
                CASE_EDIT_AUDIT,
                JSON.stringify({ case: this.caseInfo, creditor: this.creditor })
              )
              window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
              ElMessage.success('操作成功！')
            } else {
              console.error(res)
              ElMessage.error(res.msg)
            }
          })
        }
      } catch (error) {
        console.error(error)
        if (error !== 'cancel') {
          ElMessage.error(error.message)
        }
      }
    },
  },
}
</script>

<style scoped>
.creditor__func__notice {
  line-height: 2em;
}
.creditor__func__notice li {
  cursor: pointer;
}
.creditor__func__notice li:hover {
  background: #f5f7fa;
  color: #a69480;
}
.body {
  position: relative;
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  padding-bottom: 0;
  background: #f7f7f8;
  overflow: hidden;
  display: grid;
  gap: 0 20px;
  grid-template:
    "main aside" calc(100% - 38px)
    "footer footer" 38px / 1fr 450px;
  }
.main {
  grid-area: main;
  background: #fff;
  height: 100%;
}
.header {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.header h1 {
  color: #333;
  font-size: 16px;
}
.header .header_op {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header .header_op .header_func {
  text-align: right;
  font-size: 14px;
  padding-left: 10px;
  cursor: pointer;
}
.header .header_op .header_func:hover {
  color: #a69480;
}
.header .header_op .header_func.delete {
  color: red;
}
.content {
  height: calc(100% - 50px);
  padding: 20px;
  box-sizing: border-box;
}
.content_header {
  display: flex;
  justify-content: space-between;
  height: 40px;
}
.content_header_edit {
  font-size: 14px;
  cursor: pointer;
}
.content_header_edit.active {
  color: #a69480;
  font-weight: bolder;
  font-size: 15px;
}
.content_header_edit:hover {
  color: #a69480;
}
.content_box {
  height: calc(100% - 40px);
}
.aside {
  grid-area: aside;
  background: #fff;
  height: 100%;
}
.aside_header {
  height: 50px;
  box-sizing: border-box;
  padding: 0 20px;
  line-height: 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
}
.aside_header span {
  font-size: 16px;
  color: #333;
  cursor: pointer;
  border-bottom: 2px solid #ebeef5;
}
.aside_header span.active {
  color: #a69480;
  border-color: #a69480;
}
.aside_header span:hover {
  color: #a69480;
  border-color: #a69480;
}
.borderType {
  position: absolute;
  height: 8px;
  width: 8px;
  top: 11px;
  right: 12px;
  border-radius: 50%;
  background-color: #f56c6c;
}
.aside_box {
  height: calc(100% - 50px);
  padding: 20px;
  box-sizing: border-box;
}
.footer {
  grid-area: footer;
  line-height: 38px;
  font-size: 12px;
  text-align: right;
  color: #bbb;
}
.footer a {
  color: #aaa;
  margin-left: 20px;
}
.footer a:hover {
  color: #a69480;
}
</style>
