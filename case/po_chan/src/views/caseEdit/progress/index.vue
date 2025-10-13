<template>
  <div class="progress">
    <div v-for="(v, index) in list" :key="v.stageValue" :class="{'node--meeting': v.stageValue === 4 }" class="node">
      <template v-if="v.stageValue === 4">
        <!-- 债权认定 -->
        <p :class="{ 'node__title--active': v.stageTime }" class="node__title">{{ v.stageName }}</p>
        <img v-if="v.stageTime" src="./pass.svg" />
        <template v-else>
          <img v-if="v.isMeeting" src="./meeting1.svg" />
          <img v-else-if="Array.isArray(v.subStage)" src="./meeting3.svg" />
          <img v-else src="./meeting4.svg" />
        </template>
        <div class="node__info">
          <img v-if="v.stageTime" src="./dot_active.svg" />
          <img v-else src="./dot_default.svg" />
          <time v-if="v.stageTime" :datetime="v.stageTime" style="padding-top: 40px;" class="node__time">{{ v.stageTime }}</time>
          <div v-else>
            <p :title="v.meeting.stageName" class="node__txt">{{ v.meeting.stageName }}</p>
            <time :datetime="v.meeting.stageTime" class="node__time">{{ v.meeting.stageTime }}</time>
          </div>
        </div>
        <ul v-if="Array.isArray(v.history) && v.history.length" class="node__meeting">
          <li v-for="(item, i) in v.history" :key="item.stageName" class="node__info">
            <img v-if="i === (v.history.length - 1)" src="./dot_active.svg">
            <img v-else src="./dot_meeting_many.svg">
            <div>
              <p :title="item.stageName" class="node__txt">{{ item.stageName }}</p>
              <time :datetime="item.stageTime" class="node__time">{{ item.stageTime }}</time>
            </div>
          </li>
        </ul>
        <div :class="{ 'node__bar--active': v.stageTime }" class="node__bar"></div>
      </template>
      <template v-else>
        <p :class="{ 'node__title--active': v.stageTime }" class="node__title">{{ v.stageName }}</p>
        <img v-if="v.stageTime" src="./pass.svg" />
        <img v-else :src="v.icon" />
        <div class="node__info">
          <img v-if="v.stageTime" src="./dot_active.svg" />
          <img v-else src="./dot_default.svg" />
          <time :datetime="v.stageTime" class="node__time">{{ v.stageTime }}</time>
        </div>
        <div v-if="index < list.length - 1" :class="{ 'node__bar--active': v.stageTime }" class="node__bar"></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    case: {
      type: Object,
    },
  },
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await flowStageApi(this.case.projectId)
        if (res.success) {
          this.list = res.data.map(v => {
            if (v.stageValue === 1) {
              // 发布公告
              v.icon = new URL('bulletin.svg', import.meta.url).href
            } else if (v.stageValue === 2) {
              // 受理案件
              v.icon = new URL('case.svg', import.meta.url).href
            } else if (v.stageValue === 3) {
              // 债权申报
              v.icon = new URL('declare.svg', import.meta.url).href
            } else if (v.stageValue === 4) {
              // 债权认定
              v.icon = new URL('meeting4.svg', import.meta.url).href
              v.meeting = {}
              v.isMeeting = false
              const { subStage } = v
              if (subStage) {
                const [one, ...history] = subStage
                v.meeting = { ...one }
                v.history = history
                // 有会议进行中
                v.isMeeting = subStage.some(v => v.active)
              }
            } else if (v.stageValue === 5) {
              // 法院裁定确认
              v.icon = new URL('court.svg', import.meta.url).href
            } else if (v.stageValue === 6) {
              // 财产分配
              v.icon = new URL('assets.svg', import.meta.url).href
            } else if (v.stageValue === 7) {
              // 案件终结
              const url = 'end.svg'
              v.icon = new URL(`./${url}`, import.meta.url).href
            }
            return v
          })
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.progress {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.node {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-width: 200px;
  width: 100%;
}
.node__title {
  color: #333;
  font-weight: bolder;
}
.node__title--active {
  color: var(--primary-color);
}
.node__info {
  font-size: 14px;
  display: flex;
  padding-left: 20px;
}
.node__info .node__txt {
  color: #FF5222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
}
.node__info .node__time {
  color: #777;
  white-space: nowrap;
  padding-top: 38px;
}
.node.node--meeting .node__time {
  display: inline-block;
  padding-top: 18px;
}
.node.node--meeting .node__meeting {
  position: absolute;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding-top: 10px;
  width: 400px;
  top: 165px;
  left: 20px;
  overflow: hidden auto;
  max-height: 450px;
}
.node.node--meeting .node__meeting .node__info {
  padding-left: 0;
}
.node.node--meeting .node__meeting .node__info .node__txt {
  color: #777;
  width: 100%;
}
.node.node--meeting .node__meeting .node__info .node__time {
  display: inline-block;
  padding-top: 18px;
}
.node__bar {
  position: absolute;
  left: 60px;
  top: 52px;
  right: -10px;
  height: 4px;
  background-color: #f7f3f1;
}
.node__bar--active {
  background-color: var(--primary-color);
}
</style>
