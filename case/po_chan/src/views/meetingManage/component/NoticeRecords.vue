<template>
  <el-dialog :title="title" v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" top="10vh" width="1100px" @close="close()" @opened="opened">
    <div class="wrap" >
      <ul ref="asideRef" class="aside" >
        <li v-for="v in asideList" :class="{ aside_item: true, active: active === v.id }" :key="v.id" @click="onDetail(v.id)" >
          <span>{{ v.title }}</span>
          <span>{{ v.createTime }}</span>
        </li>
        <li v-if="total > params.pageNum * params.pageSize" class="no_more">
          加载中......
        </li>
        <li v-else-if="asideList.length === 0" class="cus_empty h-full"></li>
        <li v-else class="no_more">
          没有更多了
        </li>
      </ul>
      <div class="main" >
        <p class="main_title" >通知内容</p>
        <p class="main_content" >{{ detail.content }}</p>
        <p class="main_title" >通知人员</p>
        <Table :data="{ list: detail.noticeUsers, total: 0 }" :columns="columns" >
          <template #status>
            发送成功
          </template>
        </Table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { label: '债权人名称', prop: 'creditorName' },
        { label: '电话号码', prop: 'phone' },
        { label: '状态', prop: 'status' },
        { label: '发送时间', prop: 'createTime' },
      ],
      visible: false,
      asideList: [],
      total: 0,
      detail: {},
      active: '',
      params: {
        projectId: '',
        pageSize: 20,
        pageNum: 1,
        userId: '',
        sendType: '',
        recordId: '',
      },
    }
  },
  computed: {
    title() {
      const count = this.params.pageSize * this.params.pageNum
      return '短信通知记录' + `(${count > this.total ? this.total : count}/${this.total})`
    },
  },
  methods: {
    // 滚动到底部加载下一页历史记录
    opened() {
      const el = this.$refs.asideRef
      const _this = this
      let timeout
      el.onscroll = function() {
        if (_this.total <= _this.params.pageNum * _this.params.pageSize) {
          return false
        }
        if (el.scrollTop + el.offsetHeight + 50 <= el.scrollHeight) {
          return false
        }
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          _this.params.pageNum++
          _this.fetchData()
        }, 500)
      }
    },
    close() {
      this.visible = false
      this.params.pageNum = 1
      this.asideList.length = 0
      this.detail = {}
    },
    async fetchData() {
      try {
        const res = await creaditorSendNoticeHistoryApi(this.params)
        if (res.success) {
          const noticeType = ['全体通知', '个人通知', '系统公告', '团队通知']
          this.asideList = this.asideList.concat(res.data.records.map(v => ({ ...v, title: noticeType[v.noticeType] || '自定义通知' })))
          this.total = res.data.total
          if (Object.keys(this.detail).length === 0 && this.asideList.length > 0) {
            this.onDetail(this.asideList[0]['id'])
          }
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onDetail(noticeId) {
      if (!noticeId) return false
      try {
        this.detail = {}
        this.active = noticeId
        const res = await creaditorSendNoticeDetailApi(noticeId)
        if (res.success) {
          this.detail = res.data
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

<style  scoped>
:deep(.el-dialog__body) {
  padding: 0;
}
.wrap {
  display: grid;
  grid-template-columns: 185px 1fr;
  overflow: hidden;
  min-height: 500px;
}
.aside {
  border-right: 1px solid #ebeef5;
  overflow-x: hidden;
  overflow-y: auto;
}
.aside_item {
  cursor: pointer;
  padding: 15px 20px;
  box-sizing: border-box;
  line-height: 1.5em;
  text-align: left;
  background: #f6f6f6;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.aside_item:hover {
  color: #fff;
  background: #a69480;
}
.aside_item.active {
  color: #fff;
  background: #a69480;
}
.no_more {
  padding-top: 50%;
  text-align: center;
  color: #ccc;
  font-size: 14px;
}
.main {
  padding: 20px;
  box-sizing: border-box;
}
.main_title {
  line-height: 2em;
  color: #666;
  font-weight: bolder;
}
.main_content {
  background: #f6f6f6;
  padding: 12px;
  text-indent: 2em;
  height: 100px;
  border-radius: 4px;
  overflow-y: auto;
  margin-bottom: 10px;
}
</style>
