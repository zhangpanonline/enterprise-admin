<!--项目列表-->
<template>
  <div class="cus_page_header flex gap-3 items-center">
    <span class="font-bold" >{{ $route.meta.title }}</span>
    <span class="text-primary" >|</span>
    <span
      class="cus_page_header_tag"
      :class="{ 'cus_page_header_tag--active': search.status === '' }"
      @click="search.status = ''; fetchData()">
      全部
    </span>
    <span
      class="cus_page_header_tag"
      :class="{ 'cus_page_header_tag--active': search.status === '2' }"
      @click="search.status = '2'; fetchData()">
      进行中
    </span>
    <span
      class="cus_page_header_tag"
      :class="{ 'cus_page_header_tag--active': search.status === '9' }"
      @click="search.status = '9'; fetchData()">
      已结案
    </span>
    <span
      class="cus_page_header_tag"
      :class="{ 'cus_page_header_tag--active': search.status === '3' }"
      @click="search.status = '3'; fetchData()">
      已删除
    </span>
  </div>
  <header class="bg-white px-5 !h-15 flex relative gap-5 items-center" >
    <el-input class="cus_search" v-model.trim="search.caseName" placeholder="搜索案件名称" clearable @input="fetchData(1)" />
    <el-input class="cus_search" v-model.trim="search.companyName" placeholder="搜索管理人" clearable @input="fetchData(1)" />
    <el-select v-model="search.procedure" placeholder="请选择破产程序" clearable class="cus_search" @change="fetchData()">
      <el-option v-for="v in bankruptProgram" :value="v.value" :label="v.label" :key="v.label"></el-option>
    </el-select>
    <el-button type="primary" @click="fetchData()">
      <template #icon><IconEpSearch/></template>
      查询
    </el-button>
    <!-- 律所的创建人/管理员（统一权限中的角色）才可以创建 -->
    <el-button class="absolute right-5" v-if="buttonAuth[CREATE_BUTTON]" type="primary" @click="router.push({ path: '/caseManage/create' })">
      <template #icon><IconEpPlus /></template>
      新增案件
    </el-button>
  </header>
  <div class="bg-white h-full-29 px-5">
    <Table :data="tableData" :columns="tableColumns" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #procedure="{ row }">
        {{ bankruptProgram.find(v => v.value === row.procedure)?.label || '-' }}
      </template>
      <template #caozuo="scope">
        <div class="flex gap-2">
          <span v-if="!scope.row.createUser && buttonAuth[ACCEPT_BUTTON]" class="text-primary cursor-pointer flex items-center gap-2" @click="onEdit(scope.row)"><el-icon><IconEpCheck/></el-icon> 案件认领</span>
          <template v-if="scope.row.edit" >
            <span v-if="scope.row.status !== '2'" class="text-primary cursor-pointer flex items-center gap-2" @click="onEdit(scope.row)">查看</span>
            <span v-if="scope.row.status === '2'" class="text-primary cursor-pointer flex items-center gap-2" @click="onEdit(scope.row)">编辑</span>
            <span v-else-if="scope.row.status === '9'" class="text-primary cursor-pointer  flex items-center gap-2" @click="onChangeStaues(scope.row)"><el-icon><IconEpRefresh/></el-icon> 取消结案</span>
            <template v-else-if="scope.row.status === '3'">
              <span class="text-warning cursor-pointer flex items-center" @click="onReverStaues(scope.row, 'recover')"> <IconEpRefresh/>恢复案件</span>
              <span class="text-danger cursor-pointer flex items-center" @click="onReverStaues(scope.row, 'del')"><IconEpDelete/>彻底删除</span>
            </template>
          </template>
          <span v-else class="text-primary cursor-pointer flex items-center gap-2" @click="onEdit(scope.row)">查看</span>
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup>
import {
  ACCEPT_BUTTON,
  CREATE_BUTTON
} from '@/constant'
const { buttonAuth } = useButtonAuth([ACCEPT_BUTTON, CREATE_BUTTON])

const appStore = useAppStore()
const caseStore = useCaseStore()
const router = useRouter()
function onEdit(row) {
  caseStore.getCaseInfo(row.projectId)
  router.push({ path: '/caseManage/info' })
}
// 破产程序
const { bankruptProgram } = useDict('bankruptProgram')
const search = reactive({
  caseName: '',
  companyName: '',
  procedure: '',
  status: '', // 进行中（2）、已结案（9）、已删除（3）
})
const tableColumns = [
  { prop: 'caseNumber', label: '案号' },
  { prop: 'caseName', label: '案件名称' },
  { prop: 'flowStageName', label: '案件阶段' },
  { prop: 'courtName', label: '受理法院' },
  { prop: 'companyName', label: '管理人' },
  { prop: 'procedure', label: '破产程序' },
  { prop: 'statusValue', label: '案件状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right', width: 250 },
]
const tableData = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
  loading: true,
  list: [],
})
fetchData()
async function fetchData(pageNum = 1) {
  try {
    tableData.loading = true
    tableData.pageNum = pageNum
    search.companyId = appStore.userInfo.companyId
    const res = await getCaseListApi({ ...search, pageNum, pageSize: tableData.pageSize })
    if (res.success) {
      tableData.list = res.data.records
      tableData.total = res.data.total
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    tableData.loading = false
  }
}
// 取消结案
async function onChangeStaues(row) {
  try {
    const confirm = await ElMessageBox.confirm('确认取消结案？', '提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    if (confirm !== 'confirm') return false
    const res = await postChangeStatusCaseApi({ id: row.id, status: '2' })
    if (res.success) {
      ElMessage.success('操作成功！')
      fetchData()
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
// 恢复、彻底删除案件
async function onReverStaues(row, flag) {
  try {
    const confirm = await ElMessageBox.confirm(`确认${flag === 'recover' ? '恢复' : '彻底删除'}案件？`, '提示', { type: 'warning', confirmButtonText: '确认',
      cancelButtonText: '取消' })
    if (confirm !== 'confirm') return false
    const res = await postChangeStatusCaseApi({ id: row.id, status: flag === 'recover' ? '2' : '-3' })
    if (res.success) {
      ElMessage.success('操作成功！')
      fetchData()
    } else {
      console.error(res)
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
</script>
