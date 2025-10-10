<template>
  <div class="bg-white h-15 leading-15 font-bold text-base px-5 border-b-8 border-b-undertone flex justify-between items-center">
    {{ $route.meta.title }}
  </div>
  <div class="bg-white h-15 px-5 flex items-center justify-between">
    <div class="h-15 flex justify-start gap-5 items-center">
      <el-select v-model="search.projectId" style="width: 200px;" @change="fetchData(); getUserList()">
        <el-option v-for="v in caseList" :key="v.projectId" :value="v.projectId" :label="v.caseName"></el-option>
      </el-select>
      <el-select v-model="search.userIds" style="width: 200px;" multiple collapse-tags filterable placeholder="请选择人员" @change="fetchData()">
        <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
      </el-select>
      <el-date-picker v-model="search.date" :clearable="false" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="fetchData()"></el-date-picker>
      <el-button type="primary" @click="fetchData()">
        <template #icon><IconEpSearch/></template>查询
      </el-button>
    </div>
    <el-button type="primary" @click="lookFile()">
      <template #icon><IconEpView/></template>预览
    </el-button>
  </div>
  <div class="h-full-30 bg-white px-5">
    <Table :data="tableData" :columns="tableColumns" @select-all="handleSelection" @select="handleSelection" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()">
    </Table>
  </div>
  <Dialog ref="dialogRef" @ok="downloadFile" :str="html" />
</template>

<script>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import { dateFormat } from '@/plugins/date.js'
import Dialog from './Dialog.vue'
import dayjs from 'dayjs'

export default {
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  components: { Dialog },
  data() {
    return {
      search: {
        date: [],
        projectId: '',
        userIds: [],
        pageNum: 1,
        pageSize: 10,
      },
      userList: [],
      caseList: [],
      total: 0,
      checkData: [],
      html: '',
      tableColumns: [
        { type: 'selection' },
        { prop: 'context', label: '日报内容', width: 'auto' },
        { prop: 'duration', label: '小时', width: 'auto' },
        { prop: 'userName', label: '填报人', width: 'auto' },
        { prop: 'recordTime', label: '日报时间', width: 'auto' },
      ],
      tableData: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        loading: true,
      },
    }
  },
  created() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    this.search.date = [new Date(`${year}-${month}-01`), new Date(`${year}-${month}-${dayjs(new Date()).daysInMonth()}`)]
    this.getCaseList()
  },
  methods: {
    // 获取当前登录用户的案件列表
    async getCaseList() {
      try {
        const res = await getChangeCaseListApi()
        if (res.success) {
          this.caseList = res.data
          if (this.caseList.length > 0) {
            this.search.projectId = this.caseList[0]['projectId']
            this.fetchData()
            this.getUserList()
          }
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      }
    },
    // 获取所有成员
    async getUserList() {
      if (!this.search.projectId) return false
      try {
        this.userList = []
        this.search.userIds = []
        const params = {
          pageNum: 1,
          pageSize: 1000,
          companyId: this.appStore.userInfo.companyId,
          // 破产-管理人团队 方id
          companyType: '3fda4fd73fb14834b26076c1af439b60',
          projectId: this.search.projectId,
        }
        const res = await getCaseManagerApi(params)
        if (res.success) {
          this.userList = res.data.records.map(v => ({ value: v.id, label: v.chineseName }))
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      }
    },
    async fetchData(pageNum = 1) {
      try {
        this.tableData.loading = true
        this.tableData.pageNum = pageNum
        this.search.pageSize = this.tableData.pageSize
        this.search.pageNum = pageNum
        const params = {
          projectId: this.search.projectId,
          userIds: this.search.userIds,
          startTime: dateFormat(this.search.date[0]).slice(0, 10) + ' 00:00:00',
          endTime: dateFormat(this.search.date[1]).slice(0, 10) + ' 23:59:59',
          pageNum: pageNum || this.search.pageNum,
          pageSize: this.search.pageSize,
        }
        const res = await getLogRollupApi(params)
        if (res.success) {
          this.tableData.list = res.data
          this.tableData.total = res.total
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      } finally {
        this.tableData.loading = false
      }
    },
    handleSelection(v) {
      this.checkData = v
      console.log(this.checkData)
    },
    async downloadFile(html) {
      if (!html) return false
      try {
        const params = {
          bankrupt_summary: html,
        }
        const res = await downloadFileApi(params)
        if (res.success) {
          const file = res.data
          obsFileDownload(file.filePath, '文件.docx')
          this.$refs.dialogRef.visible = false
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        ElMessage.error({ message: error.message, showClose: false })
      }
    },
    lookFile() {
      let str = ''
      if (Array.isArray(this.checkData) && this.checkData.length) {
        this.checkData.forEach((el, i) => {
          str += (i + 1) + '.' + el.context + '&nbsp;&nbsp;&nbsp;' + '(填报人：' + el.userName + ')' + '<br />'
        })
        this.html = str
        this.$refs.dialogRef.visible = true
      } else {
        ElMessage.warning({ message: '请选择内容', showClose: false })
        return
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-range-editor.el-input__wrapper) {
  flex: initial;
}
</style>
