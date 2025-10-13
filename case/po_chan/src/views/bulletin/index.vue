<!--项目列表-->
<template>
  <div class="cus_page_header">
    {{ $route.meta.title }}
  </div>
  <div class="h-15 px-5 bg-white justify-between items-center flex" >
    <el-input v-model.trim="searchData.keyword" placeholder="请输入关键字查询" class="cus_search" clearable @input="getProjectList()" />
    <el-button v-if="buttonAuth[$route.path]?.includes(CREATE_BUTTON)" type="primary" @click="onEdit({}, true)">
      <template #icon><IconEpPlus/></template>
      发布公告
    </el-button>
  </div>
  <div class="bg-white h-full-29 px-5">
    <Table :data="tableData" :columns="tableColumns" @fetchData="getProjectList" @sizeChange="searchData.pageSize = $event; getProjectList()"  >
      <template #caozuo="scope">
        <span class="text-primary cursor-pointer mr-3" @click="onEdit(scope.row)">查看</span>
        <span v-if="buttonAuth[$route.path]?.includes(EDIT_BUTTON)" class="text-primary cursor-pointer" @click="onEdit(scope.row, true)">编辑</span>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { CREATE_BUTTON, EDIT_BUTTON } from '@/constant/index.js'
const { buttonAuth } = storeToRefs(useAppStore())
const router = useRouter()
const tableData = reactive({
  pageSize: 20,
  pageNum: 1,
  total: 0,
  loading: true,
})
const tableColumns = [
  { prop: 'caseNumber', label: '案号' },
  { prop: 'debtorCompanyName', label: '债务人名称' },
  { prop: 'custodianCompanyName', label: '管理人' },
  { prop: 'announcementDate', label: '发布时间' },
  { prop: 'caozuo', label: '查看' },
]
function onEdit(row, bool) {
  router.push({ path: '/bulletin/create', query: { ...row, isEdit: bool }})
}
const searchData = reactive({
  pageSize: 10,
  pageNum: 1,
  keyword: '',
})
onMounted(() => {
  getProjectList()
})
async function getProjectList(pageNum = 1) {
  try {
    tableData.loading = true
    searchData.pageNum = pageNum
    tableData.pageNum = searchData.pageNum
    tableData.pageSize = searchData.pageSize
    const res = await announcementPageApi(searchData)
    if (res.success) {
      tableData.list = res.data.records
      tableData.total = res.data.total
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  } finally {
    tableData.loading = false
  }
}
</script>
