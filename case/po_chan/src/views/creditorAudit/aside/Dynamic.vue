<template>
  <ul ref="boxRef" class="box">
    <li v-for="(v, i) in list" :Key="v.createTime + i" class="box_li">
      <p class="box_li_title">
        <span class="main_text">{{ v.createUser }}</span>
        <span class="sub_text">{{ v.createTime }}</span>
      </p>
      <p class="sub_text">{{ v.record }}</p>
      <p v-for="o in v.recordDetail" :key="o.key + o.value">
        <span class="main_text">【{{ o.key }}】：</span>
        <span class="main_text">{{ o.value }}</span>
      </p>
    </li>
    <li v-if="total > pageNum * pageSize" class="no_more">
      加载中......
    </li>
    <li v-else-if="list.length === 0" class="cus_empty h-full w-full">
    </li>
    <li v-else class="no_more">
      没有更多了
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    caseInfo: {
      type: Object,
      required: true,
    },
    creditor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
    }
  },
  created() {
    this.list.length = 0
    this.fetchData()
  },
  mounted() {
    const el = this.$refs.boxRef
    let timeout
    el.onscroll = () => {
      if (this.total < this.pageNum * this.pageSize) {
        return false
      }
      if (el.scrollTop + el.offsetHeight + 50 < el.scrollHeight) {
        return false
      }
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.pageNum++
        this.fetchData()
      }, 500)
    }
  },
  methods: {
    async fetchData() {
      try {
        const { creditorId, moneyDetailId } = this.creditor
        const projectId = this.caseInfo.projectId
        const res = await dynamicApi({ projectId, creditorId, moneyDetailId, pageSize: this.pageSize, pageNum: this.pageNum })
        if (res.success) {
          this.list = this.list.concat(res.data.records)
          this.total = res.data.total
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
  },
}
</script>

<style scoped>
.main_text {
  color: #333;
}
.sub_text {
  color: #999;
}
.box {
  height: 100%;
  overflow-y: auto;
  padding-left: 10px;
  font-size: 14px;
  line-height: 2.5em;
  overflow-x: hidden;
}
.box_li {
  position: relative;
  padding: 0 20px 20px 20px;
}
.box_li::before {
  content: ' ';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #a69480;
  position: absolute;
  top: 0px;
  left: -9px;
}
.box_li::after {
  content: ' ';
  width: 2px;
  background: #a69480;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
.box_li:last-child .box_li:last-child::after {
  content: none;
}
.box_li_title {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
}
.no_more {
  padding-top: 50%;
  text-align: center;
  color: #ccc;
  font-size: 14px;
}
</style>
