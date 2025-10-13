<template>
  <el-drawer
    :size="400"
    v-model="visible"
    title="签到统计">
    <div class="sign">
      <div class="sign__card sign__card--dark ">
        <p class="sign__text sign__text--xx">到会人数比例</p>
        <p class="sign__text sign__text--xxx">{{ counter.peoplePercent }}</p>
        <ul class="sign__peope sign__text--x">
          <el-popover
            placement="bottom-start"
            title="应到会人数"
            popper-class="meetingInfoSignPopover"
            width="150"
            trigger="hover">
            <template #reference>
              <li class="sign__text sign__text--dark pointer">
                <p>应到会人数</p>
                <p>{{ counter.peopleTotal }}</p>
              </li>
            </template>
            <ul>
              <li>个人：{{ counter.allTypeCountList['个人'] }}</li>
              <li>职工：{{ counter.allTypeCountList['职工'] }}</li>
              <li>企业：{{ counter.allTypeCountList['企业'] }}</li>
            </ul>
          </el-popover>
          <el-popover
            placement="bottom-start"
            title="已签到人数"
            popper-class="meetingInfoSignPopover"
            width="150"
            trigger="hover">
            <template #reference>
              <li class="sign__text sign__text--dark pointer">
                <p>已签到人数</p>
                <p>{{ counter.peopleSigned }}</p>
              </li>
            </template>
            <ul>
              <li>个人：{{ counter.signedTypeCountList['个人'] }}</li>
              <li>职工：{{ counter.signedTypeCountList['职工'] }}</li>
              <li>企业：{{ counter.signedTypeCountList['企业'] }}</li>
            </ul>
          </el-popover>
          <el-popover
            placement="bottom-start"
            title="未签到人数"
            popper-class="meetingInfoSignPopover"
            width="150"
            trigger="hover">
            <template #reference>
              <li class="sign__text sign__text--dark pointer">
                <p>未签到人数</p>
                <p>{{ counter.peopleTotal - counter.peopleSigned }}</p>
              </li>
            </template>
            <ul>
              <li>个人：{{ counter.unSignedTypeCountList['个人'] }}</li>
              <li>职工：{{ counter.unSignedTypeCountList['职工'] }}</li>
              <li>企业：{{ counter.unSignedTypeCountList['企业'] }}</li>
            </ul>
          </el-popover>
        </ul>
      </div>
      <div class="sign__card sign__card--light">
        <p class="sign__item">
          <span class="sign__ring sign__ring--purple">
            应到会债权总额
          </span>
          <span class="sign__money">{{ formatCNY(counter.moneyTotal) }}</span>
        </p>
        <p class="sign__item">
          <span class="sign__ring sign__ring--orange">
            到会债权总额
          </span>
          <span class="sign__money">{{ formatCNY(counter.moneySigned) }}</span>
        </p>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  setup() {
    const { formatCNY } = useFormatMoney()
    return { formatCNY }
  },
  data() {
    return {
      visible: false,
      counter: {
        peopleTotal: '-',
        peopleSigned: '-',
        peoplePercent: '-',
        moneyTotal: '-',
        moneySigned: '-',
        moneyPercent: '-',
        allTypeCountList: {},
        signedTypeCountList: {},
        unSignedTypeCountList: {},
      },
    }
  },
}
</script>
<style scoped >
.meetingInfoSignPopover .el-popover__title {
  background: #32365fee;
  color: #ddd;
}
.meetingInfoSignPopover.el-popover {
  background: #32365fee;
  color: #ddd;
  border: 1px solid #555;
}
</style>
<style scoped>
.pointer {
  cursor: pointer;
}
.sign {
  padding: 0 12px;
  background-color: #fafafb;
  height: 100%;
  overflow: hidden auto;
  font-size: 14px;
}
.sign__card {
  border-radius: 5px;
  margin-top: 20px;
}
.sign__card--dark {
  background: #32365f;
  color: #fff;
  padding: 20px;
}
.sign__card--light {
  background-color: #fff;
  padding: 12px 0;
}
.sign__text {
  line-height: 2em;
}
.sign__peope {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}
.sign__text--dark {
  color: #ddd;
}
.sign__text--x {
  font-size: 12px;
}
.sign__text--xx {
  font-size: 14px;
}
.sign__text--xxx {
  font-size: 18px;
}
.sign__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  padding-left: 40px;
}
.sign__ring {
  position: relative;
  color: #444;
}
.sign__ring--purple::before {
  position: absolute;
  left: -25px;
  top: 2px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid #9d64e7;
  border-radius: 50%;
}
.sign__ring--orange::before {
  position: absolute;
  left: -25px;
  top: 2px;
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border: 6px solid #ec9738;
  border-radius: 50%;
}
.sign__money {
  color: #666;
}
</style>
