<template>
  <el-header class="h-15 flex gap-5 items-center" >
    <p class="text-sm text-primary cursor-pointer flex items-center" @click="$emit('back')"><ElIcon><IconEpBack/></ElIcon>返回</p>
    <el-input
      v-model="searchData.voucherName"
      placeholder="请输入产权名称"
      class="cus_search"
      clearable
      @change="getList()"
    ></el-input>
    <el-input
      v-model="searchData.voucherUser"
      placeholder="请输入产权人姓名"
      class="cus_search"
      clearable
      @change="getList()"
    ></el-input>
    <el-select
      v-model="searchData.voucherCategory"
      placeholder="请选择类目"
      clearable
      @change="getList()"
      class="cus_search">
      <el-option
        v-for="item in voucherCategory"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" @click="getList()">
      <template #icon><IconEpSearch/></template>查询
      </el-button>
    <el-button class="!m-0" type="primary" v-if="caseInfo.edit === 'true'" @click="onEdit()">
      <template #icon><IconEpPlus/></template>
      新增
    </el-button>
  </el-header>
  <div class="h-full-15 px-5 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @fetchData="getList" @sizeChange="tableData.pageSize = $event; getList()"  >
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer" @click="onDetail(scope.row)">查看</span>
          <span class="text-primary cursor-pointer" v-if="caseInfo.edit === 'true'" @click="onEdit(scope.row)">编辑</span>
          <span class="text-warning cursor-pointer" @click="handleDel(scope.row)" v-if="caseInfo.edit === 'true'">删除</span>
        </div>
      </template>
    </Table>
  </div>
  <Edit ref="editRef" @ok="getList()" />
  <Detail ref="detailRef" />
</template>

<script setup>
import Detail from './Detail.vue'
import Edit from './Edit.vue'
const appStore = useAppStore()
const editRef = ref(null)
const detailRef = ref(null)
const route = useRoute()
const { caseInfo } = defineProps({
  caseInfo: {
    type: Object,
    required: true,
  },
})
const tableHeader = [
  { type: 'index', label: '序号', width: '55' },
  { prop: 'voucherCategoryName', label: '类目' },
  { prop: 'voucherName', label: '产权名称' },
  { prop: 'voucherUser', label: '产权人' },
  { prop: 'voucherTypeName', label: '产权类型' },
  { prop: 'voucherRadiusName', label: '权利范围' },
  { prop: 'voucherNumber', label: '登记号' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'endDate', label: '到期时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
function onDetail(row) {
  detailRef.value.form.id = row.id
  detailRef.value.visible = true
}
function onEdit(row) {
  editRef.value.form.projectId = caseInfo.projectId
  editRef.value.form.createUser = appStore.userInfo.userId
  if (row) {
    editRef.value.form.id = row.id
  }
  editRef.value.visible = true
}
const searchData = reactive({
  voucherCategory: '',
})
const { tableData, fetchData, delData } = useTable()
getList()
async function getList(pageNum = 1) {
  tableData.pageNum = pageNum
  fetchData({
    api: setLedgeVoucherList,
    pageNum,
    params: {
      projectId: route.query.projectId,
      ...searchData,
    },
  })
}
function handleDel(val) {
  delData({
    api: deleteKnowledgeVoucher,
    id: val.id,
    callback: getList,
  })
}
const { voucherCategory } = useDict('voucherCategory')
</script>
