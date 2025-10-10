<template>
  <el-header class="h-15 flex gap-5 items-center" >
    <p class="text-sm text-primary cursor-pointer flex items-center" @click="$emit('back')"><ElIcon><IconEpBack/></ElIcon>返回</p>
    <el-input v-model="search.assetsName" placeholder="请输入名称" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-input v-model="search.assetsName" placeholder="请输入名称" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-input v-model="search.assetsNumber" placeholder="请输入编号" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-select v-model="search.statue" placeholder="请选择状态" clearable class="cus_search" @change="fetchData()">
      <el-option :value="true" label="正常"></el-option>
      <el-option :value="false" label="失效"></el-option>
    </el-select>
    <el-date-picker v-model="search.date" placeholder="有效期" class="cus_search" clearable @change="fetchData()"/>
    <el-button type="primary" @click="fetchData()">
      <template #icon><IconEpSearch/></template>
      查询
    </el-button>
    <el-button class="!m-0" type="primary" v-if="caseInfo.edit === 'true'" @click="onEdit()">
      <template #icon><IconEpPlus/></template>
      新增
    </el-button>
  </el-header>
  <div class="h-full-15 px-5 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #assetsAmount="scope">
        {{ formatCNY(scope.row.assetsAmount) }}
      </template>
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer " @click="onEdit(scope.row, true)"> 查看</span>
          <span v-if="caseInfo.edit === 'true'" class="text-primary cursor-pointer"  @click="onEdit(scope.row)"> 编辑</span>
          <span v-if="caseInfo.edit === 'true'" class="text-warning cursor-pointer"  @click="onDel(scope.row)"> 删除</span>
        </div>
      </template>
    </Table>
  </div>
  <Edit ref="editRef" @ok="fetchData()" />
  <Detail ref="detailRef" />
</template>
<script setup>
import Edit from './Edit.vue'
import Detail from './Detail.vue'
const { caseInfo } = defineProps({
  caseInfo: {
    type: Object,
    required: true,
  },
})
const { formatCNY } = useFormatMoney()
const tableHeader = [
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsName', label: '名称' },
  { prop: 'assetsNumber', label: '编号' },
  { prop: 'assetsTypeName', label: '类型' },
  { prop: 'assetsAmount', label: '费用（元）' },
  { prop: 'startDate', label: '登记时间' },
  { prop: 'endDate', label: '有效期' },
  { prop: 'statusName', label: '状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
const search = reactive({
  assetsName: '',
  assetsNumber: '',
  statue: '',
  date: '',
})
// 编辑
const editRef = ref(null)
const detailRef = ref(null)
function onEdit(row, isLook = false) {
  editRef.value.form.projectId = caseInfo.projectId
  editRef.value.form.createUser = useAppStore().userInfo.userId
  if (row) {
    editRef.value.form.id = row.id
  }
  if (isLook) {
    detailRef.value.form.projectId = caseInfo.projectId
    detailRef.value.form.createUser = useAppStore().userInfo.userId
    if (row) {
      detailRef.value.form.id = row.id
    }
    detailRef.value.visible = true
  } else {
    editRef.value.visible = true
    editRef.value.isLook = isLook
  }
}
const { tableData, fetchData: getList, delData } = useTable()
// 查询
fetchData()
async function fetchData(pageNum = 1) {
  const params = { ...search, projectId: caseInfo.projectId, pageNum, pageSize: tableData.pageSize }
  if (search.date) {
    params.date = useDateFormat(this.search.date, 'YYYY-MM-DD').value
  }
  getList({
    pageNum,
    api: getAssetsInvisibleApi,
    params,
  })
}
// 删除
function onDel({ id }) {
  delData({
    api: delAssetsInvisibleApi,
    id,
    callback: fetchData,
  })
}
</script>
