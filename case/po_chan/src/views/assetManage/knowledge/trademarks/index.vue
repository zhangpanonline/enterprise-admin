<template>
  <el-header class="flex  items-center justify-between" >
    <div class="flex gap-5 justify-start items-center">
    <el-input v-model="search.assetsName" placeholder="请输入商标名称" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-input v-model="search.assetsNo" placeholder="请输入注册号" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-select v-model="search.assetsStatus" placeholder="请选择商标状态" clearable class="cus_search" @change="fetchData()">
      <el-option v-for="v in assetsStatusDict" :value="v.value" :label="v.label" :key="v.value"></el-option>
    </el-select>
    <el-date-picker v-model="search.startTime" class="cus_search" clearable placeholder="申请开始日期" value-format="YYYY-MM-DD" @change="fetchData()" ></el-date-picker>
    <el-date-picker v-model="search.endTime" class="cus_search" clearable placeholder="申请结束日期" value-format="YYYY-MM-DD" @change="fetchData()" ></el-date-picker>
    <el-button type="primary" @click="fetchData()">
      <template #icon><IconEpSearch/></template>
      查询
    </el-button>
  </div>

    <div class="flex gap-5" >
      <el-button type="primary" v-if="buttonAuth[TAB1_EXPORT]" @click="exportAll(true)">
        <template #icon><IconEpDownload /></template>
        选择导出
      </el-button>
      <el-button v-if="buttonAuth[TAB1_EXPORT]" class="!m-0" type="primary"  @click="exportAll(false)">
        <template #icon><IconEpDownload /></template>
        全部导出
      </el-button>
      <el-button class="!m-0" type="primary" v-if="buttonAuth[TAB1_CREATE]" @click="onEdit()">
        <template #icon><IconEpPlus/></template>
        新增
      </el-button>
    </div>
  </el-header>
  <div class="h-full-15 bg-white px-5 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @selection-change="addComList"  @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #debtorCompanyName>
        {{ caseInfo.debtorCompanyName }}
      </template>
      <template #filePath="scope">
        <img v-if="scope.row.filePath" class="h-15 cursor-pointer" :src="VITE_OBS_URL + scope.row.filePath" @click="onPreviewImage(0, [{ url: VITE_OBS_URL + scope.row.filePath, name: scope.row.filePath }])" />
        <span v-else >-</span>
      </template>
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer " @click="onLook(scope.row)"> 查看</span>
          <span v-if="buttonAuth[TAB1_EDIT]" class="text-primary cursor-pointer"  @click="onEdit(scope.row)"> 编辑</span>
          <span v-if="buttonAuth[TAB1_DELETE]" class="text-warning cursor-pointer"  @click="onDel(scope.row)"> 删除</span>
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
import { TAB1_CREATE, TAB1_EDIT, TAB1_DELETE, TAB1_EXPORT } from '@/constant/index.js'
const { caseInfo } = storeToRefs(useCaseStore())
const { buttonAuth } = useButtonAuth([TAB1_CREATE, TAB1_EDIT, TAB1_DELETE, TAB1_EXPORT], caseInfo.value.isEdit)
const VITE_OBS_URL = import.meta.env.VITE_OBS_URL
const { onPreviewImage } = usePreviewImage()
const { knowledge_trademarks_assets_status: assetsStatusDict } = useDict('knowledge_trademarks_assets_status')
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
  search.projectId = caseInfo.value.projectId

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

const exportAll = async(type) => {
  let params
  if (type) {
    if (ids.value) {
      params = {
        type: MAIN_TYPE,
        subType: SUB_TYPE,
        ids: ids.value,
        projectId: caseInfo.value.projectId,

      }
      console.log(1)
    } else {
      ElMessage.error({ message: '请选择要导出的信息', showClose: false })

      return
    }
  } else {
    params = {
      type: MAIN_TYPE,
      subType: SUB_TYPE,
      projectId: caseInfo.value.projectId,

    }
  }
  const res = await expAssets(params)
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  console.log(res)

  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = '商标列表' // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
const ids = ref()
const addComList = (val) => {
  console.log(val)
  ids.value = val.map((item, index) => {
    return item.id
  })
}
</script>
