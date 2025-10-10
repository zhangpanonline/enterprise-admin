<template>
  <div class="bg-white h-15 leading-15 font-bold text-base px-5 border-b-8 border-b-undertone flex justify-between items-center">
    {{ $route.meta.title }}
  </div>
  <div class="bg-white h-15 px-5 flex justify-between items-center" >
    <ul class="h-15 flex justify-start gap-5 items-center" >
      <el-date-picker v-model="search.startTime" class="cus_search" placeholder="请选择开始时间" @change="fetchData()" />
      <el-date-picker v-model="search.endTime" class="cus_search" placeholder="请选择结束时间" @change="fetchData()" />
      <el-button type="primary"  @click="fetchData()">
        <template #icon><IconEpSearch/></template>
        查询
      </el-button>
    </ul>
    <el-button type="primary" @click="dialogRef.visible = true">
      <template #icon><IconEpPlus /></template>
      新增
    </el-button>
  </div>
  <div class="h-full-30 bg-white px-5">
    <Table :data="tableData" :columns="tableColumns" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #caozuo="scope">
        <span class="text-primary cursor-pointer mr-2" @click="onEdit(scope.row)"> 编辑</span>
        <span class="text-warning cursor-pointer" @click="onDel(scope.row)">删除</span>
      </template>
    </Table>
  </div>
  <Dialog ref="dialogRef" @ok="fetchData()" />
</template>

<script setup>
import Dialog from './Dialog.vue'
const search = reactive({
  startTime: '',
  endTime: '',
})
const tableColumns = [
  { type: 'index', label: '序号', width: '55' },
  { prop: 'title', label: '日报名称' },
  { prop: 'userName', label: '填报人' },
  { prop: 'createTime', label: '填报时间' },
  { prop: 'recordTime', label: '日报时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
const dialogRef = ref(null)
function onEdit(row) {
  const { bankruptDailyRecordDetails, ...copy } = JSON.parse(JSON.stringify(row))
  dialogRef.value.form = { ...copy, detailParamList: bankruptDailyRecordDetails }
  dialogRef.value.visible = true
}

const { tableData, fetchData: getList, delData } = useTable()
// 查询
fetchData()
async function fetchData(pageNum = 1) {
  const params = {
    startTime: search.startTime ? useDateFormat(search.startTime, 'YYYY-MM-DD').value : '',
    endTime: search.endTime ? useDateFormat(search.endTime, 'YYYY-MM-DD').value : '',
  }
  getList({
    pageNum,
    api: getDailyApi,
    params,
    callback(res) {
      tableData.list = res.data
      tableData.total = res.total
    },
  })
}
// 删除
function onDel({ id }) {
  delData({
    api: delDailyApi,
    id,
    callback: fetchData,
  })
}
</script>
