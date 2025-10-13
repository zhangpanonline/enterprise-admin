<template>
  <div class="cus_page_header">
    {{ $route.meta.title }}
  </div>
  <div class="bg-white h-15 flex px-5 justify-end items-center" >
    <el-button type="primary" v-if="buttonAuth[CREATE_BUTTON]" @click="onEdit()">
      <template #icon><IconEpPlus/></template>
      新增
    </el-button>
  </div>
  <div class="h-full-29 bg-white px-5 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #debtorCompanyName>
        {{ caseInfo.debtorCompanyName }}
      </template>
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer " @click="onLook(scope.row)"> 查看</span>
          <span v-if="buttonAuth[EDIT_BUTTON]" class="text-primary cursor-pointer" @click="onEdit(scope.row)"> 编辑</span>
          <span v-if="buttonAuth[DELETE_BUTTON]" class="text-warning cursor-pointer" @click="onDel(scope.row)"> 删除</span>
        </div>
      </template>
    </Table>
  </div>
  <Edit ref="editRef" @ok="fetchData()" />
  <Detail ref="detailRef" />
</template>

<script setup>
import { MAIN_TYPE, SUB_TYPE, tableHeader } from './config.js'
import Edit from './Edit.vue'
import Detail from './Detail.vue'
import { CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON } from '@/constant/index.js'
const { caseInfo } = storeToRefs(useCaseStore())
const { buttonAuth } = useButtonAuth([CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON], caseInfo.value.isEdit)

const search = reactive({
  assetsName: '',
  assetsNo: '',
  assetsStatus: '',
  startTime: '',
  endTime: '',
})
// 编辑
const editRef = ref(null)
function onEdit(row) {
  if (row) {
    editRef.value.form.id = row.id
  }
  editRef.value.visible = true
}
// 查看
const detailRef = ref(null)
function onLook(row) {
  detailRef.value.form.id = row.id
  detailRef.value.visible = true
}
const { tableData, fetchData: getList, delData } = useTable()
// 查询
fetchData()
async function fetchData(pageNum = 1) {
  const params = {
    ...search,
    status: 0,
    type: MAIN_TYPE,
    subType: SUB_TYPE,
  }
  getList({
    pageNum,
    api: bankruptAssetsPageApi,
    params,
  })
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
