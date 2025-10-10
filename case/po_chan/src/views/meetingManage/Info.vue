<template>
  <div class="info">
    <ul class="info__header">
      <li>
        <el-button v-if="isSave" size="mini" type="primary" @click="openNoticeRecords()">
          <el-icon class="mr-3" ><IconEpPostcard /></el-icon>
          短信通知记录
        </el-button>
        <el-popover v-else placement="bottom-start" width="150" trigger="click">
          <ul class="info__notice">
            <li @click="openNotice()">
              <el-icon class="mr-3" ><IconEpChatDotSquare /></el-icon>
              短信通知
            </li>
            <li @click="openNoticeRecords()">
              <el-icon class="mr-3" ><IconEpPostcard /></el-icon>
              短信通知记录
            </li>
          </ul>
          <template #reference>
            <el-button size="mini" type="primary">
              <el-icon class="mr-3" ><IconEpPosition /></el-icon>
              通知参会人
            </el-button>
          </template>
        </el-popover>
        <el-button style="margin-left: 20px;" size="mini" type="primary" @click="onExport()">
          <el-icon class="mr-3" ><IconEpDownload /></el-icon>导出</el-button>
      </li>
      <li>
        <el-select v-model="params.signed" size="mini" style="width: 200px;" @change="fetchList()">
          <el-option value="all" label="全部"></el-option>
          <el-option value="0" label="未签到"></el-option>
          <el-option value="1" label="已签到"></el-option>
        </el-select>
        <el-select v-model="params.natureOne" style="width: 200px; margin-left: 20px;" placeholder="请选择债权性质" size="mini" clearable @change="fetchList()">
          <el-option v-for="v in NATURE_CLAIM" :key="v.value" :label="v.label" :value="v.value"></el-option>
        </el-select>
        <el-input v-model="params.creditorName" size="mini" style="width: 200px; margin-left: 20px;" placeholder="债权人" @input="fetchList()" />
      </li>
    </ul>
    <div class="info__body">
      <el-table v-loading="loading" :data="tableData" size="mini" stripe border style="width: 100%">
        <el-table-column prop="creditorNum" label="债权人编号" min-width="80"></el-table-column>
        <el-table-column label="通知状态" min-width="100">
          <template v-slot="{ row }">
            {{ formatNotice(row.noticeTotal) }}
          </template>
        </el-table-column>
        <el-table-column prop="creditorName" label="参会人名称" min-width="150"></el-table-column>
        <el-table-column prop="creditorPhone" label="手机号码" min-width="100"></el-table-column>
        <el-table-column prop="agentName" label="代理人" min-width="80"></el-table-column>
        <el-table-column prop="agentPhone" label="代理人手机号" min-width="100"></el-table-column>
        <el-table-column prop="statusName" label="债权状态" min-width="100"></el-table-column>
        <el-table-column prop="natureOneName" label="认定债权性质" min-width="100"></el-table-column>
        <el-table-column prop="confirmTotal" label="认定债权总额" min-width="100">
          <template v-slot="scope">
            {{ formatCNY(scope.row.confirmTotal) }}
          </template>
        </el-table-column>
        <el-table-column label="签到时间" min-width="150">
          <template v-slot="scope">
            {{ scope.row.signTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="参会签到" width="100">
          <template v-slot="scope">
            <el-popover :disabled="isSave" placement="bottom-start" trigger="click">
              <span :class="[ 'table__sign', scope.row.signed === 0 ? 'table__sign--yes' : 'table__sign--no' ]" @click="updateSigned(scope.row)">
                {{ scope.row.signed === 0 ? '已签到' : '未签到' }}
              </span>
              <template #reference>
                <span :class="[ 'table__sign', scope.row.signed === 1 ? 'table__sign--yes' : 'table__sign--no' ]">
                  {{ scope.row.signed === 0 ? '未签到' : '已签到' }}
                  <el-icon v-if="!isSave" ><IconEpArrowDown /></el-icon>
                </span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="info__pagination">
      <el-pagination
        :current-page="params.pageNum"
        :page-size="20"
        :total="total"
        background
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        @current-change="fetchList($event)" />
    </div>
    <div class="info__footer">
      <span class="info__number info__number--left">应到人数 {{ counter.peopleTotal }} 人</span>
      <span class="info__number info__number--left">实到人数 {{ counter.peopleSigned }} 人</span>
      <span class="info__number info__number--left">到会债权总额 {{ formatCNY(counter.moneySigned) }} </span>
      <span class="info__number info__number--right" style="cursor: pointer;" @click="openDetail()">查看详情<el-icon><IconEpArrowRight /></el-icon></span>
      <span class="info__number info__number--right">到会债权 {{ counter.moneyPercent }}</span>
      <span class="info__number info__number--right">到会人数 {{ counter.peoplePercent }}</span>
    </div>
    <!-- 通知 -->
    <Notice ref="noticeRef" @success="fetchList()" />
    <!-- 通知记录 -->
    <NoticeRecords ref="noticeRecordsRef" />
    <!-- 签到统计 -->
    <InfoSign ref="infoSignRef" />
  </div>
</template>

<script>
import Notice from './component/Notice.vue'
import NoticeRecords from './component/NoticeRecords.vue'
import InfoSign from './component/InfoSign.vue'
import { NATURE_CLAIM } from '@/constant'
export default {
  setup() {
    const appStore = useAppStore()
    const { formatCNY } = useFormatMoney()
    const formatNotice = num => {
      if (num) {
        return `已通知（${num}）`
      } else {
        return `未通知`
      }
    }
    return { appStore, formatCNY, formatNotice }
  },
  components: { Notice, NoticeRecords, InfoSign },
  props: {
    caseInfo: {
      type: Object,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
    // 当前会议是否已保存
    isSave: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        signed: 'all',
        creditorName: '',
        natureOne: '', // 债权性质
      },
      counter: {
        peopleTotal: '-',
        peopleSigned: '-',
        peoplePercent: '-',
        moneyTotal: '-',
        moneySigned: '-',
        moneyPercent: '-',
      },
      tableData: [],
      loading: false,
      total: 0,
      NATURE_CLAIM, // 债权性质
    }
  },
  created() {
    this.fetchList()
    this.getDetail()
  },
  methods: {
    // 打开通知弹框
    openNotice() {
      const params = {
        projectId: this.caseInfo.projectId,
        userId: this.appStore.userInfo.userId,
        sendType: 3,
        noticeType: 1, // 通知类型，1：个人通知；2：系统公告；3：团队通知
        status: null,
        recordId: this.row.id,
      }
      this.$refs.noticeRef.params = params
      this.$refs.noticeRef.content = `您好，请于 ${this.row.meetTime} 到筑术云平台参加【${this.row.meetName}】；请于 ${this.row.meetTime} 前登录 ${import.meta.env.VITE_MEETING_URL + this.row.meetCode} 参加债权人会议`
      this.$refs.noticeRef.visible = true
    },
    // 打开通知记录
    openNoticeRecords() {
      this.$refs.noticeRecordsRef.visible = true
      this.$refs.noticeRecordsRef.params.projectId = this.caseInfo.projectId
      this.$refs.noticeRecordsRef.params.userId = this.appStore.userInfo.userId
      this.$refs.noticeRecordsRef.params.sendType = 3
      this.$refs.noticeRecordsRef.params.recordId = this.row.id
      this.$refs.noticeRecordsRef.fetchData()
    },
    // 获取统计信息
    async getDetail() {
      try {
        const res = await meetSignDetailApi(this.row.id)
        if (res.success) {
          const {
            allConfirmTotal,
            allCreditorCount,
            signedConfirmTotal,
            signedCreditorCount,

            allTypeCountList,
            signedTypeCountList,
            unSignedTypeCountList,
          } = res.data
          this.counter = {
            peopleTotal: allCreditorCount,
            peopleSigned: signedCreditorCount,
            peoplePercent: (signedCreditorCount / allCreditorCount * 100).toFixed(2) + '%',
            moneyTotal: allConfirmTotal,
            moneySigned: signedConfirmTotal,
            moneyPercent: (signedConfirmTotal / allConfirmTotal * 100).toFixed(2) + '%',
            allTypeCountList: allTypeCountList.reduce((acc, cur) => { acc[Object.keys(cur)[0]] = Object.values(cur)[0]; return acc }, {}),
            signedTypeCountList: signedTypeCountList.reduce((acc, cur) => { acc[Object.keys(cur)[0]] = Object.values(cur)[0]; return acc }, {}),
            unSignedTypeCountList: unSignedTypeCountList.reduce((acc, cur) => { acc[Object.keys(cur)[0]] = Object.values(cur)[0]; return acc }, {}),
          }
          if (Number(allCreditorCount) === 0) {
            this.counter.peoplePercent = '0.00%'
          }
          if (Number(allConfirmTotal) === 0) {
            this.counter.moneyPercent = '0.00%'
          }
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      }
    },
    // 分页
    async fetchList(pageNum = 1) {
      try {
        this.loading = true
        const params = {
          ...this.params,
          pageNum,
          projectId: this.caseInfo.projectId,
          meetCode: this.row.meetCode,
          signed: this.params.signed === 'all' ? null : this.params.signed,
          meetId: this.row.id,
        }
        const res = await meetSignListApi(params)
        if (res.success) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      } finally {
        this.loading = false
      }
    },
    openDetail() {
      this.$refs.infoSignRef.visible = true
      this.$refs.infoSignRef.counter = this.counter
    },
    async onExport() {
      try {
        const res = await meetSignExportApi({ meetCode: this.row.meetCode, projectId: this.row.projectId, meetId: this.row.id })
        const blob = new Blob([res])
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = '会议签到表' + '.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      }
    },
    // 修改签到状态
    async updateSigned({ creditorId, signed, creditorName }) {
      const _this = this
      ElMessageBox.confirm(`修改债权人 ${creditorName} 签到状态！`, '确认修改？', {
        type: 'warning',
        async callback(flag) {
          if (flag !== 'confirm') return false
          try {
            const res = await meetSignUpdateApi({ creditorId, signed, meetId: _this.row.id })
            if (res.success) {
              _this.fetchList()
              _this.getDetail()
            } else {
              ElMessage.error(res.msg)
            }
          } catch (error) {
            console.error(error)
            ElMessage.error(error.message || '服务器出错，请重试！')
          }
        },
      })
    },
  },
}
</script>

<style scoped>
.info__notice {
  line-height: 2.5em;
}
.info__notice li {
  cursor: pointer;
}
.info__notice li:hover {
  background: #f5f7fa;
  color: #a69480;
}
.info {
  height: 100%;
  overflow: hidden;
}
.info__header {
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 20px;
}
.info__body {
  height: calc(100% - 110px);
  padding: 12px 20px 0;
  box-sizing: border-box;
}
.el-table {
  height: 100%;
}
:deep(.el-table__body-wrapper) {
  height: calc(100% - 36px);
  overflow-y: auto;
  overflow-x: hidden;
}
.info__pagination {
  height: 40px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.info__footer {
  height: 30px;
  box-sizing: border-box;
  padding: 0 20px;
}
.info__number {
  color: #999;
  font-size: 14px;
}
.info__number--left {
  float: left;
  padding-right: 20px;
}
.info__number--right {
  float: right;
  padding-left: 20px;
}
.info__footer::after{
  content: '';
  display: block;
  clear: both;
}
.table__sign {
  color: #fff;
  display: block;
  text-align: center;
  width: 79px;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  border-radius: 30px;
}
.table__sign--yes {
  background-color: #42b94f;
}
.table__sign--no {
  background-color: #a69480;
}
</style>
