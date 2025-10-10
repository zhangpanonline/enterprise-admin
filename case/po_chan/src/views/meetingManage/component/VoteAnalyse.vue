<template>
  <div class="analyse">
    <div class="analyse__card analyse__card--dark">
      <p>同意表决人数比例</p>
      <p style="font-size: 18px;">{{ formatPer(detail.agreeCount, detail.allCreditorCount) }}%</p>
      <ul class="analyse__data">
        <li>同意表决</li><li>不同意表决</li><li>弃权表决</li><li>未投票</li>
        <li>{{ detail.agreeCount }}</li><li>{{ detail.disagreeCount }}</li><li>{{ detail.abstainCount }}</li><li>{{ detail.notVoteCount }}</li>
      </ul>
      <p>投票人数：{{ detail.voteRecordCount }}/{{ detail.allCreditorCount }}</p>
    </div>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money analyse__money--color1">
        <span>应投票总额</span>
        <span>{{ formatCNY(detail.signConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.signConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money  analyse__money--color2">
        <span>已投票</span>
        <span>{{ formatCNY(detail.voteRecordConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.voteRecordConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money  analyse__money--color3">
        <span>同意表决</span>
        <span>{{ formatCNY(detail.agreeConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.agreeConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money  analyse__money--color4">
        <span>不同意表决</span>
        <span>{{ formatCNY(detail.disagreeConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.disagreeConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money  analyse__money--color5">
        <span>弃权表决</span>
        <span>{{ formatCNY(detail.abstainConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.abstainConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
    <ul class="analyse__card analyse__item analyse__card--light">
      <li class="analyse__money  analyse__money--color6">
        <span>未投票</span>
        <span>{{ formatCNY(detail.notVoteConfirmTotal) }}</span>
      </li>
      <li style="font-size: 16px;"> {{ formatPer(detail.notVoteConfirmTotal, detail.allConfirmTotal) }}% </li>
    </ul>
  </div>
</template>
<script>

export default {
  setup() {
    const { formatCNY } = useFormatMoney()
    const formatPer = (n1, n2) => {
      if (n2 === 0) {
        return '0.00'
      } else {
        return (n1 / n2 * 100).toFixed(2)
      }
    }
    return { formatCNY, formatPer }
  },
  props: {
    cardInfo: {
      type: Object,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detail: {},
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const params = {
          meetCode: this.row.meetCode,
          projectId: this.row.projectId,
          voteId: this.cardInfo.voteId,
        }
        const res = await meetVoteStatisticsApi(params)
        if (res.success) {
          this.detail = res.data
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      }
    },
  },
}
</script>
<style scoped>
.analyse {
  width: 100%;
  height: calc(100% + 35px);
  overflow: hidden auto;
  font-size: 14px;
  position: relative;
  top: -35px;
}
.analyse__card {
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 15px;
}
.analyse__card--dark {
  background-color: #32365f;
  color: #ece8e8;
}
.analyse__card--light {
  margin-left: 3px;
  margin-right: 3px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.analyse__card--light:hover {
  background: linear-gradient(90deg, #f1f1f1 0%, #fff 50%, #f1f1f1 100%);
}
.analyse__data {
  padding: 20px 0;
  display: grid;
  gap: 5px;
  grid-template: 1fr 1fr / 1fr 1fr 1fr 1fr;
  white-space: nowrap;
  text-align: center;
}
.analyse__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  padding-left: 30px;
}
.analyse__money {
  display: flex;
  flex-direction: column;
  line-height: 1.5em;
  position: relative;
}
.analyse__money--color1::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #d16ab6;
}
.analyse__money--color2::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #9d64e7;
}
.analyse__money--color3::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #ec9738;
}
.analyse__money--color4::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #3cbbad;
}
.analyse__money--color5::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #7176fc;
}
.analyse__money--color6::after {
  position: absolute;
  left: -23px;
  top: 3px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid transparent;
  border-radius: 50%;
  border-color: #ed7948;
}
</style>
