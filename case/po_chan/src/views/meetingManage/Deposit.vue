<template>
  <article class="deposit">
    <header class="deposit__header">
      <h1>
        {{ formatEmpty(basic.meetName) }}
      </h1>
      <div>
        <el-button v-if="buttonAuth[RECORD_BUTTON]" size="mini" style="background-color: #e4dfd9;" @click="onDialog()">证据记录</el-button>
        <el-button v-if="!isSave" type="primary" size="mini" @click="fetchData('pdf')">生成保全证书</el-button>
      </div>
    </header>

    <article class="deposit__article">
      <h3 class="deposit__title">
        会议基本信息
      </h3>
      <p class="deposit__content">
        案件名称 &nbsp;&nbsp;{{ formatEmpty(basic.caseName) }}
      </p>
      <p class="deposit__content">
        会议名称 &nbsp;&nbsp;{{ formatEmpty(basic.meetName) }}
      </p>
      <p class="deposit__content">
        会议时间 &nbsp;&nbsp;<time :datetime="basic.meetTime">{{ formatEmpty(basic.meetTime) }}</time>
      </p>
      <p class="deposit__content">
        会议地点 &nbsp;&nbsp;{{ formatEmpty(basic.meetAddress) }}
      </p>
    </article>

    <article class="deposit__article">
      <h3 class="deposit__title">
        一、债权人会议线上参会情况
      </h3>
      <p class="deposit__content">
        通过筑术云平台参与债权人会议，应到会人数为 <span class="text">{{ formatEmpty(attendMeetStatistics.allCreditorCount) }}</span> 人，实际到会人数为 <span class="text">{{ formatEmpty(attendMeetStatistics.signedCreditorCount) }}</span> 人，到会人数比例为 <span class="text">{{ formatEmpty(attendMeetStatistics.creditorProportion) }} %</span>。
      </p>
      <p class="deposit__content">
        此次会议债权总额为 <span class="text">{{ formatCNY(attendMeetStatistics.allConfirmTotal) }}</span> 元，到会代表的债权金额为 <span class="text">{{ formatCNY(attendMeetStatistics.signedConfirmTotal) }}</span> 元，到会债权金额比例为 <span class="text">{{ formatEmpty(attendMeetStatistics.creditorAmountProportion) }} %</span>。
      </p>
      <p class="deposit__content">
        其中：
        <span v-for="(v, i) in attendMeetStatistics.natureAmount" :key="v.dictLabel">
          <template v-if="i > 0">，</template>
          {{ formatEmpty(v.dictLabel) }}总额为：<span class="text">{{ formatCNY(v.amount) }}</span> 元
        </span>
        。
      </p>
    </article>

    <article v-if="voteStatisticsVos.length > 0" class="deposit__article">
      <h3 class="deposit__title">
        二、债权人会议投票表决情况
      </h3>
      <p class="deposit__content">
        本次债权人会议表决内容共计 <span class="text">{{ voteStatisticsVos.length }}</span> 项，各表决项表决情况如下：
      </p>
      <section v-for="(v, i) in voteStatisticsVos" :Key="v.voteId">
        <p class="deposit__subtitle">
          {{ i + 1 }}.《{{ v.voteName }}》表决统计结果
        </p>
        <p class="deposit__content">
          通过筑术云平台参与该项表决的人数 <span class="text">{{ v.voteRecordCount }}</span> 人。表决债权金额共计 <span class="text">{{ formatCNY(v.voteRecordConfirmTotal) }}</span> 元。
        </p>
        <p class="deposit__content">
          已投票决议人数：<span class="text">{{ v.voteRecordCount }}</span> 人，已投票人数占债权人总数的 <span class="text">{{ v.voteRecordCountProportion }} %</span>， 已投票的债权人所代表的的债权金额为 <span class="text">{{ formatCNY(v.voteRecordConfirmTotal) }}</span> 元，债权金额占债权总额的 <span class="text">{{ v.voteRecordConfirmTotalProportion }} %</span>。
        </p>
        <p class="deposit__content">
          同意表决决议人数：<span class="text">{{ v.agreeCount }}</span> 人，同意表决人数占债权人总数的<span class="text">{{ v.agreeCountProportion }} %</span>， 同意表决的债权人所代表的的债权金额为 <span class="text">{{ formatCNY(v.agreeConfirmTotal) }}</span> 元，债权金额占债权总额的 <span class="text">{{ v.agreeConfirmTotalProportion }} %</span>。
        </p>
        <p class="deposit__content">
          不同意表决决议人数：<span class="text">{{ v.disagreeCount }}</span> 人，不同意表决人数占债权人总数的 <span class="text">{{ v.disagreeCountProportion }} %</span>， 不同意表决的债权人所代表的的债权金额为 <span class="text">{{ formatCNY(v.disagreeConfirmTotal) }}</span> 元，债权金额占债权总额的 <span class="text">{{ v.disagreeConfirmTotalProportion }} %</span>。
        </p>
        <p class="deposit__content">
          弃权表决决议人数：<span class="text">{{ v.abstainCount }}</span> 人，弃权表决人数占债权人总数的 <span class="text">{{ v.abstainCountProportion }} %</span>， 弃权表决的债权人所代表的的债权金额为 <span class="text">{{ formatCNY(v.abstainConfirmTotal) }}</span> 元，债权金额占债权总额的 <span class="text">{{ v.abstainConfirmTotalProportion }} %</span>。
        </p>
        <p class="deposit__content">
          未投票决议人数：<span class="text">{{ v.notVoteCount }}</span> 人，未投票人数占债权人总数的 <span class="text">{{ v.notVoteCountProportion }} %</span>， 未投票的债权人所代表的的债权金额为 <span class="text">{{ formatCNY(v.notVoteConfirmTotal) }}</span> 元，债权金额占债权总额的 <span class="text">{{ v.notVoteConfirmTotalProportion }} %</span>。
        </p>
      </section>
    </article>
    <DepositRecord ref="depositRecordRef" />
  </article>
</template>

<script>
import DepositRecord from './component/DepositRecord.vue'
import { RECORD_BUTTON } from '@/constant'
export default {
  components: { DepositRecord },
  setup() {
    const { formatCNY } = useFormatMoney()
    function formatEmpty(val) {
      return [null, undefined].includes(val) ? '-' : val
    }
    const { buttonAuth } = useButtonAuth([RECORD_BUTTON])
    return { formatCNY, formatEmpty, buttonAuth, RECORD_BUTTON }
  },
  props: {
    row: {
      type: Object,
      required: true,
    },
    isSave: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      attendMeetStatistics: {},
      basic: {},
      voteStatisticsVos: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData(str) {
      var loadingInstance = false
      try {
        loadingInstance = ElLoading.service({
          fullscreen: true,
          text: `${str ? '正在生成证书' : '正在查询'}，请稍等......`,
          spinner: 'loading-animation',
        })
        const res = await meetDepositGetCertificateApi(this.row.id, str ? 1 : null)
        if (res.success) {
          this.basic = res.data.basic
          this.attendMeetStatistics = res.data.attendMeetStatistics
          this.voteStatisticsVos = res.data.voteStatisticsVos || []
          if (str) {
            ElMessage.success('操作成功！')
          }
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      } finally {
        this.$nextTick(() => { loadingInstance.close() })
      }
    },
    onDialog() {
      this.$refs.depositRecordRef.visible = true
      this.$refs.depositRecordRef.meetId = this.row.id
      this.$refs.depositRecordRef.meetCode = this.row.meetCode
      this.$refs.depositRecordRef.meetName = this.row.meetName
    },
  },
}
</script>

<style scoped>
.deposit {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden auto;
}
.deposit__header {
  display: flex;
  justify-content: space-between;
}
.deposit__header h1 {
  font-size: 20px;
  font-weight: normal;
  color: #333;
}
.deposit__article .deposit__title {
  font-size: 18px;
  font-weight: normal;
  color: #333;
  line-height: 4em;
}
.deposit__article .deposit__subtitle {
  font-size: 16px;
  background-color: #f9f9f9;
  color: #333;
  line-height: 3em;
  padding: 0 20px;
}
.deposit__article .deposit__content {
  font-size: 14px;
  background-color: #f9f9f9;
  color: #666;
  line-height: 2.5em;
  padding: 0 20px;
}
.deposit__article .text {
  color: #000;
  text-decoration: underline;
}
</style>
