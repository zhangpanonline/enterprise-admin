<template>
  <div class="cus_page_header">
      案件消息
  </div>
  <div class="bg-white px-5 h-15 flex items-center justify-between" >
    <div class="flex gap-5 justify-start items-center" >
        <el-date-picker v-model="time" class="cus_search" clearable placeholder="选择时间" value-format="YYYY-MM-DD" @change="setData" ></el-date-picker>
        <el-input v-model="search.content" placeholder="请输入关键字" class="cus_search" clearable @change="getList()"></el-input>
        <el-button type="primary" @click="getList()">
          <template #icon><IconEpSearch/></template>
          查询
        </el-button>
      </div>
  </div>
  <div class="h-full-29 bg-white px-5 overflow-hidden relative">
    <Table :data="tableData" :columns="tableHeader" @fetchData="getList" @sizeChange="search.pageSize = $event; getList()">
      <template #extras="scope">
          {{setFile(scope.row)}}
      </template>
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer " @click="onLook(scope.row)"> 查看</span>
        </div>
      </template>
    </Table>
  </div>

  <Detail ref="detailRef" />
</template>
<script setup>
import { tableHeader } from './config.js'
import Detail from './Detail.vue'
const VITE_OBS_URL = import.meta.env.VITE_OBS_URL
const { caseInfo } = storeToRefs(useCaseStore())
const appStore = useAppStore()

const search = reactive({
    sysCode: 'BANKRUPT',
    pageSize: 10,
    pageNumber: 1,
    noticeType: 'SYSTEM_NOTICE',
    type: 'IN_MAIL_MESSAGE',
    userId: appStore.userInfo.id,
  content: '',
  extendedQuery:caseInfo.value.projectId
})
// 查看
const detailRef = ref(null)
function onLook (row) {
  Object.assign(detailRef.value.form,row);
  detailRef.value.visible = true
}

const setFile = (val) => {
  try {

    const file = JSON.parse(val.extras.replaceAll('"[', '[').replaceAll(']"', ']'))
    if (file.file) {

      return  file.file[0].fileName
    }
  } catch (error) {

  }
}
const time = ref('')
const setData = (val) => {
  if (val) {

    search.startTime = time.value + ' 00:00:00'
    search.endTime = time.value + ' 23:59:59'
  } else {
    search.startTime = ''
    search.endTime =''
  }
  getList()
}
const tableData = reactive({
  list: [],
  pageSize: 10,
  pageNum: 1,
  total: 0,
  loading: true,
})
// 查询
getList()
async function getList (pageNum = 1) {
  try {
    search.pageNumber = pageNum
    tableData.loading = true
    tableData.pageNum = pageNum
    const res = await getUserPushLog(search)
    if (res.success) {
      tableData.list = res.data
      tableData.total = res.total
      console.log(tableData.value)
    }
  }catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message })
  } finally {
    tableData.loading = false
  }

}
// 删除
function onDel({ id }) {
  delData({
    api: bankruptAssetsDelApi,
    id: { id, type: MAIN_TYPE },
    callback: fetchData,
  })
}
</script>
