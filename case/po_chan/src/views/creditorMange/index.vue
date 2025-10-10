<template>
  <div class="cus_page_header flex gap-3 items-center">
    <span>{{ $route.meta.title }}</span>
    <span class="text-primary" >|</span>
    <span
      v-for="(v, k) in tab"
      :key="k"
      :class="{ cus_page_header_tag: true, 'cus_page_header_tag--active': k === tabKey }"
      @click="
        tabKey = k;
        fetchPageData();
        fetchTotal();
        fetchNumApi();">
      {{ v.label + `(${v.value})` }}
    </span>
  </div>
  <div class="bg-white overflow-hidden h-full-14">
    <ul class="h-15 flex justify-between items-center px-5" >
      <li class="flex gap-5" >
        <el-select
          v-model="searchParams.creditorType"
          class="cus_search"
          placeholder="请选择债权人类型"
          size="mini"
          clearable
          @change="fetchData()">
          <el-option
            v-for="v in dict.creditorType"
            :key="v.value"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="searchParams.creditorName"
          class="cus_search"
          placeholder="请输入债权人名称"
          size="mini"
          clearable
          @input="fetchData()">
          <template #suffix>
            <el-icon>
              <IconEpSearch />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="fetchData()">
          <template #icon><IconEpSearch/></template>
          查询
        </el-button>
      </li>
      <!-- 通知、新增等功能按钮 -->
      <li class="flex gap-5" >
        <el-popover
          style="padding-right: 10px; float: left;"
          placement="bottom-start"
          width="150"
          trigger="click">
          <div class="creditor__func__notice">
            <ul>
              <li @click="openNotice('msg')">
                <el-icon>
                  <IconEpChatDotSquare />
                </el-icon>
                短信通知
              </li>
              <li @click="openNoticeRecords('msg')">
                <el-icon>
                  <IconEpPostcard />
                </el-icon>
                短信通知记录
              </li>
            </ul>
            <el-divider />
            <ul>
              <li @click="openNotice('sys')">
                <el-icon>
                  <IconEpChatDotSquare />
                </el-icon>
                系统通知
              </li>
              <li @click="openNoticeRecords('sys')">
                <el-icon>
                  <IconEpPostcard />
                </el-icon>
                系统通知记录
              </li>
            </ul>
          </div>
          <template v-if="buttonAuth[NOTICE_BUTTON]" #reference>
            <el-button type="primary" >
              <el-icon class="mr-1">
                <IconEpPosition />
              </el-icon>
              通知债权人
            </el-button>
          </template>
        </el-popover>
        <el-button
          v-if="buttonAuth[CREATE_BUTTON]"
          type="primary"
          class="!m-0"
          @click="openCreate()">
          <el-icon class="mr-1" >
            <IconEpPlus />
          </el-icon>
          新增债权人
        </el-button>
        <el-popover
          placement="bottom-start"
          width="150"
          trigger="click">
          <ul class="creditor__func__notice">
            <li v-if="buttonAuth[CREATE_BUTTON]" @click="openUpload()" >导入债权人</li>
            <li v-if="buttonAuth[EXPORT_BUTTON]" @click="onExport()">导出核查债权表</li>
            <li v-if="buttonAuth[ASSIGN_BUTTON]" @click="openCensor()" >分配审查负责人</li>
          </ul>
          <template #reference>
            <el-button type="primary" v-if="buttonAuth[CREATE_BUTTON] || buttonAuth[EXPORT_BUTTON] || buttonAuth[ASSIGN_BUTTON]"  class="!m-0">
              更多
              <el-icon class="ml-1" >
                <IconEpArrowDown />
              </el-icon>
            </el-button>
          </template>
        </el-popover>
      </li>
    </ul>
    <!-- table -->
    <div class="creditor__table">
      <el-table
        v-loading="loading"
        :data="tableData"
        :span-method="objectSpanMethod"
        @selection-change="handleSelectionChange"
        :header-cell-style="headerCellStyle" :row-style="rowStyle"
      >
        <el-table-column width="50" type="selection"></el-table-column>
        <el-table-column prop="creditorNum" label="债权人编号" />
        <el-table-column prop="statusName" label="审查状态" />
        <el-table-column
          prop="creditorName"
          label="债权人名称"
          show-overflow-tooltip
        />
        <el-table-column prop="reviewerChineseName" label="审查负责人" />
        <el-table-column prop="dictLabel" label="债权人类型" />
        <el-table-column
          prop="socialCreditCode"
          label="债权人身份证号/社会统一信用代码"
          width="210"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span v-if="scope.row.dictLabel === '企业'">{{ scope.row.socialCreditCode }}</span>
            <span v-else>{{ scope.row.legarIdcard }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="申报总额" show-overflow-tooltip>
          <template #default="scope">
            {{ formatCNY(scope.row.total) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="respiteTotal"
          label="暂缓确认金额"
          width="130"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ formatCNY(scope.row.respiteTotal) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="noConfirmTotal"
          label="不予确认金额"
          width="130"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ formatCNY(scope.row.noConfirmTotal) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="opinionVO"
          label="债权异议"
          width="130"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.opinionVO ? scope.row.opinionVO.remarks : '无'" placement="bottom">
              <span>{{ scope.row.opinionVO ? scope.row.opinionVO.examineStatusName : '无' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirmTotal"
          label="认定债权总额"
          width="130"
          show-overflow-tooltip>
          <template #default="scope">
            {{ formatCNY(scope.row.confirmTotal) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="natureOneName"
          label="认定债权性质"
          show-overflow-tooltip
          width="130"
        />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <p class="flex items-center gap-3" >
              <span v-if="scope.row.canReviewer && buttonAuth[AUDIT_BUTTON]" class="text-primary cursor-pointer" @click="onAudit(scope.row)">审定</span>
              <span v-if="scope.row.canReviewer && buttonAuth[DELETE_BUTTON]" class="text-warning cursor-pointer" @click="onDelete(scope.row)">删除</span>
              <span v-else class="text-warning cursor-pointer">-</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 统计 -->
    <div class="creditor__count">
      <span>共<b class="number">{{ count.creditorCount }}</b>位债权人</span>
      <span><!-- 空白展位 --></span>
      <span>共计申报<b class="number">{{ count.moneyCount }}</b>笔债权</span>
      <span>申报债权总额<b class="number">{{formatCNY(count.moneyTotal)}}</b></span>
      <span>审查债权总额<b class="number">{{formatCNY(count.confirmMoneyTotal)}}</b></span>
    </div>
    <!-- 分页 -->
    <div class="creditor__pagination">
      <el-pagination
        class="h-10 justify-end items-center"
        :current-page="searchParams.pageNum"
        :page-sizes="[20]"
        :page-size="20"
        :total="totalCount"
        background
        layout="total, prev, pager, next, jumper"
        @size-change="
          $event => {
            searchParams.pageSize = $event;
            fetchPageData();
          }
        "
        @current-change="
          $event => {
            searchParams.pageNum = $event;
            fetchPageData();
          }
        "
      />
    </div>
    <!-- 新增债权人 -->
    <Create
      ref="createRef"
      :dict-creditor-type="dict.creditorType"
      @ok="fetchData()"
    />
    <!-- 批量导入债权人 -->
    <Upload ref="uploadRef" @ok="fetchData()" />
    <!-- 分配审查负责人 -->
    <Censor ref="censorRef" @ok="censorOk" />
    <!-- 通知 -->
    <Notice ref="noticeRef" />
    <!-- 通知记录 -->
    <NoticeRecords
      ref="noticeRecordsRef"
      :dict-creditor-type="dict.creditorType"
    />
  </div>
</template>

<script>
import Create from './Create.vue'
import Upload from './Import.vue'
import Censor from './Censor.vue'
import Notice from '@/views/creditorAudit/Notice.vue'
import NoticeRecords from './NoticeRecords.vue'
import {
  MANAGE,
  CASE_EDIT_AUDIT,
  CASE_EDIT_AUDIT_UPDATE,
  CREATE_BUTTON,
  ASSIGN_BUTTON,
  NOTICE_BUTTON,
  EXPORT_BUTTON,
  AUDIT_BUTTON, DELETE_BUTTON
} from '@/constant'
export default {
  components: { Create, Upload, Censor, Notice, NoticeRecords },
  setup() {
    const { caseInfo } = storeToRefs(useCaseStore())
    const appStore = useAppStore()
    const { formatCNY } = useFormatMoney()
    const { buttonAuth } = useButtonAuth([CREATE_BUTTON, ASSIGN_BUTTON, NOTICE_BUTTON, EXPORT_BUTTON, AUDIT_BUTTON, DELETE_BUTTON], caseInfo.value.isEdit)
    return { appStore, formatCNY, caseInfo, buttonAuth, CREATE_BUTTON, ASSIGN_BUTTON, NOTICE_BUTTON, EXPORT_BUTTON, AUDIT_BUTTON, DELETE_BUTTON }
  },
  data() {
    return {
      MANAGE,
      tableData: [],
      searchParams: {
        pageNum: 1,
        pageSize: 20,
        creditorName: '',
        creditorType: '',
      },
      loading: false,
      totalCount: 0,
      tab: {
        all: { label: '全部', value: 0, status: null },
        pre: { label: '待申报', value: 0, status: -1 },
        wait: { label: '待审定', value: 0, status: 0 },
        reject: { label: '驳回形审', value: 0, status: 5 },
        pass: { label: '通过形审', value: 0, status: 7 },
        doing: { label: '审定中', value: 0, status: 2 },
        done: { label: '已审定', value: 0, status: 9 },
      },
      tabKey: 'all',
      selectRow: [],
      // 表格底部债权统计
      // "creditorCount": 债权人数量 "moneyCount": 申报债权笔数  "moneyTotal": 申报债权总额 "confirmMoneyTotal": 认定总额
      count: {},
      dict: {
        creditorType: [], // 债权人类型
      },
      // 点击审定时选中的id
      selectAuditId: '',
    }
  },
  created() {
    this.getDict()
    this.fetchData()
    window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'false')
    window.addEventListener('storage', this.watchStorage)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.watchStorage)
  },
  methods: {
    // 表头样式
    headerCellStyle() {
      return { background: 'var(--primary-color-100)' }
    },
    // 行样式
    rowStyle({ row }) {
      if (row.__hasBg) {
        return { background: 'var(--primary-color-100)' }
      }
    },
    // 监听缓存的信息是否已更新 && 监听债权信息是否已删除
    watchStorage(e) {
      if (e.key === CASE_EDIT_AUDIT_UPDATE) {
        const _this = this
        ElMessageBox.confirm('点击确定刷新！', '债权信息有更新', {
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          closeOnHashChange: false,
          callback() {
            if (e.newValue === 'delete') {
              _this.selectAuditId = ''
            }
            _this.fetchData()
          },
        })
      }
    },
    fetchData() {
      this.fetchPageData()
      this.fetchTotal()
      this.fetchNumApi()
    },
    // 表格底部债权统计
    async fetchTotal() {
      try {
        const res = await findCreditorOverviewApi({
          projectId: this.caseInfo.projectId,
          userId: this.appStore.userInfo.userId,
          creditorType: this.searchParams.creditorType,
          creditorName: this.searchParams.creditorName,
          status: this.tab[this.tabKey]['status'],
        })
        if (res.success) {
          this.count = res.data
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 债权人列表分页
    async fetchPageData(pageNum = this.searchParams.pageNum) {
      try {
        this.loading = true
        const res = await creditorForPageApi({
          ...this.searchParams,
          pageNum,
          projectId: this.caseInfo.projectId,
          status: this.tab[this.tabKey]['status'],
          userId: this.appStore.userInfo.userId,
        })
        if (res.success) {
          this.tableData = res.data.records
          let moneyDetailId = null
          let ind = ''
          let rows = 0
          let hasBg = true
          this.tableData.forEach((v, i) => {
            if (i === 0 || v.moneyDetailId === null) {
              moneyDetailId = v.moneyDetailId
              ind = i
              rows = 1
              hasBg = !hasBg
              v.__rows = rows
              v.__show = true
              v.__hasBg = hasBg
            } else {
              if (v.moneyDetailId === moneyDetailId) {
                ++rows
                for (let j = ind; j <= i; j++) {
                  this.tableData[j]['__rows'] = rows
                  this.tableData[j]['__show'] = j === ind
                  this.tableData[j]['__hasBg'] = hasBg
                }
              } else {
                moneyDetailId = v.moneyDetailId
                ind = i
                rows = 1
                hasBg = !hasBg
                v.__rows = rows
                v.__show = true
                v.__hasBg = hasBg
              }
            }
          })
          this.totalCount = res.data.total
          if (this.selectAuditId) {
            const row = this.tableData.find(v => v.id === this.selectAuditId)
            // 存储行数据，在审定页面获取
            if (row) {
              window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'false')
            }
          }
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.loading = false
      }
    },
    // 合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([11, 12, 13].includes(columnIndex)) {
        return {
          rowspan: 1,
          colspan: 1,
        }
      } else {
        if (row.__show) {
          return {
            rowspan: row.__rows,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 1,
          }
        }
      }
    },
    // 获取每个状态下的债权数量
    async fetchNumApi() {
      try {
        const res = await creditorFindNumApi({
          projectId: this.caseInfo.projectId,
          userId: this.appStore.userInfo.userId,
          creditorType: this.searchParams.creditorType,
          creditorName: this.searchParams.creditorName,
        })
        if (res.success) {
          res.data.forEach(({ status, total }) => {
            // 待申报
            if (status === -1) this.tab.pre.value = total
            // 待审定
            else if (status === 0) this.tab.wait.value = total
            // 通过形审
            else if (status === 7) this.tab.pass.value = total
            // 驳回形审
            else if (status === 5) this.tab.reject.value = total
            // 审定中
            else if (status === 2) this.tab.doing.value = total
            // 已审定
            else if (status === 9) this.tab.done.value = total
            // 全部
            else this.tab.all.value = total
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
    async getDict() {
      try {
        const res = await getDictApi({ code: 'bankruptUnitType' })
        if (res.success) {
          this.dict.creditorType = res.data.map(v => ({
            label: v.dictLabel,
            value: v.id,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 选中的行数据
    handleSelectionChange(row) {
      this.selectRow = row
    },
    openCreate() {
      this.$refs.createRef.visible = true
      this.$refs.createRef.projectId = this.caseInfo.projectId
    },
    openUpload() {
      this.$refs.uploadRef.visible = true
      this.$refs.uploadRef.projectId = this.caseInfo.projectId
      this.$refs.uploadRef.userId = this.appStore.userInfo.userId
    },
    // 选择分配审查负责人
    openCensor() {
      if (this.totalCount === 0) {
        ElMessage.warning('暂无可分配债权人！')
        return false
      }
      this.$refs.censorRef.visible = true
      this.$refs.censorRef.projectId = this.caseInfo.projectId
      this.$refs.censorRef.total = this.selectRow.length === 0 ? this.totalCount : this.selectRow.length
      if (this.selectRow.length) {
        const creditorTypes = this.selectRow.map(v => v.creditorType)
        this.$refs.censorRef.creditorTypes = [...new Set(creditorTypes)].toString()
      } else {
        this.$refs.censorRef.creditorTypes = ''
      }
      this.$refs.censorRef.getManagerUser()
    },
    // 分配审查负责人
    async censorOk(reviewerId) {
      try {
        const params = { reviewerId }
        if (this.selectRow.length === 0) {
          params.status = this.tab[this.tabKey]['status']
          params.creditorName = this.searchParams.creditorName
          params.creditorType = this.searchParams.creditorType
          params.projectId = this.caseInfo.projectId
          params.userId = this.appStore.userInfo.userId
        } else {
          params.creditorIds = this.selectRow.map(v => v.id)
        }
        const res = await assignReviewerApi(params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.$refs.censorRef.close()
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
    // 批量导出
    async onExport() {
      if (this.totalCount === 0) {
        ElMessage.warning('暂无债权人信息！')
        return false
      }
      try {
        const res = await creditorExportExcelApi(this.caseInfo.projectId)
        const blob = new Blob([res])
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        a.href = url
        const title = this.caseInfo?.debtorCompanyName.includes('公司') ? this.caseInfo.debtorCompanyName : (this.caseInfo.debtorCompanyName + '公司')
        a.download = title + '核查债权表' + '.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 打开通知弹框
    openNotice(type) {
      if (this.totalCount === 0) {
        ElMessage.warning('暂无可通知债权人！')
        return false
      }
      const params = {
        projectId: this.caseInfo.projectId,
        userId: this.appStore.userInfo.userId,
        sendType: type === 'msg' ? 2 : 1,
        noticeType: 1, // 通知类型，1：个人通知；2：系统公告；3：团队通知
      }
      if (this.selectRow.length === 0) {
        params.status = this.tab[this.tabKey]['status']
        params.creditorName = this.searchParams.creditorName
        params.creditorType = this.searchParams.creditorType
      } else {
        params.creditorIds = this.selectRow.map(v => v.creditorId)
      }
      this.$refs.noticeRef.params = params
      this.$refs.noticeRef.type = type
      this.$refs.noticeRef.visible = true
      this.$refs.noticeRef.num =
        this.selectRow.length === 0 ? this.totalCount : this.selectRow.length
    },
    // 打开通知记录
    openNoticeRecords(type) {
      this.$refs.noticeRecordsRef.type = type
      this.$refs.noticeRecordsRef.visible = true
      this.$refs.noticeRecordsRef.params.projectId = this.caseInfo.projectId
      this.$refs.noticeRecordsRef.params.userId = this.appStore.userInfo.userId
      this.$refs.noticeRecordsRef.params.sendType = type === 'msg' ? 2 : 1
      this.$refs.noticeRecordsRef.fetchData()
    },
    // 删除数据
    async onDelete({ creditorId, moneyDetailId, moneyNatureId }) {
      try {
        const confirm = await ElMessageBox.confirm('确认删除当前数据？', '提示', {
          type: 'warning',
        })
        if (confirm !== 'confirm') return false
        const res = await creditorDelPageApi({
          creditorId,
          moneyDetailId,
          moneyNatureId,
        })
        if (res.success) {
          this.fetchData()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        if (error !== 'cancel') {
          ElMessage.error(error.message)
        }
      }
    },
    // 跳转审定页面
    onAudit(row) {
      this.selectAuditId = row.id
      const path = this.$router.resolve('/creditorAudit')
      // 存储行数据，在审定页面获取
      window.localStorage.setItem(
        CASE_EDIT_AUDIT,
        JSON.stringify({ creditor: row, case: this.caseInfo })
      )
      window.open(path.href)
    },
  },
}
</script>

<style scoped>
:deep(.el-divider--horizontal) {
  margin: 12px 0;
}
.creditor__func__notice {
  line-height: 2em;
}
.creditor__func__notice li {
  cursor: pointer;
  padding-left: 8px;
}
.creditor__func__notice li:hover {
  background: var(--primary-color-100);
  color: var(--primary);
  border-radius: 4px;
}
.creditor__func {
  height: 50px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.creditor__func::after {
  content: "";
  display: block;
  clear: both;
}

.creditor__search {
  height: 40px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: grid;
  align-items: center;
  grid-template: none / auto auto auto auto auto auto auto 1fr auto auto;
  gap: 20px;
}
.creditor__search__tab {
  box-sizing: border-box;
  line-height: 40px;
  height: inherit;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
}
.creditor__search__tab.active {
  color: #a69480;
  border-bottom: 2px solid #a69480;
}
.creditor__table {
  padding: 0 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  height: calc(100% - 140px);
}
.creditor__table .el-table {
  border-bottom: none;
  height: 100%;
}
.creditor__table .el-table :deep(.el-table__body-wrapper) {
  height: calc(100% - 60px);
  overflow-y: auto;

}
.creditor__table .el-table :deep(.el-table__body-wrapper) .el-table__expanded-cell {
  padding-left: 90px;
}
.creditor__table .el-table :deep(.el-table__body-wrapper) .el-table__expanded-cell .table_value {
  line-height: 3em;
  color: #909399;
  font-weight: bolder;
}
.creditor__count {
  padding: 0 20px;
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  color: #999;
  display: grid;
  grid-template: none / auto 1fr auto auto auto;
  gap: 20px;
}
.number {
  color: #a69480;
  padding: 0 0.2em;
}
.creditor__pagination {
  height: 40px;
}
.el-pagination {
  margin: 0;
}

.el-table {
  /* 边框颜色 */
  --el-table-border-color: transparent;
  /* 行选中颜色 */
  --el-table-current-row-bg-color: var(--primary-color-200);
  --el-table-row-hover-bg-color: var(--primary-color-200);
  height: calc(100% - 60px);
}
:deep(.el-scrollbar__view) {
  height: 100%;
}
:deep(.el-table__empty-text) {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
