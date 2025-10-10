<template>
  <div class="cus_page_header">
    {{ $route.meta.title }}
  </div>
  <div class="bg-white px-5 h-15 flex justify-between items-center" >
    <div class="flex gap-5 items-center" >
      <el-input v-model="search.assetsName" placeholder="请输入账户" class="cus_search" clearable @change="fetchData()"></el-input>
      <el-input v-model="search.applyUser" placeholder="请输入报销人" class="cus_search" clearable @change="fetchData()"></el-input>
      <el-date-picker  type="daterange" v-model="time" clearable start-placeholder="开始时间"
      end-placeholder="结束时间" value-format="YYYY-MM-DD" @change="fetchData()" ></el-date-picker>
      <el-button type="primary" @click="fetchData()">
        <template #icon><IconEpSearch/></template>
        查询
      </el-button>
    </div>
    <div class="flex gap-5" >
      <el-button v-if="buttonAuth[EXPORT_BUTTON]" type="primary" @click="exportAll(true)">
        <template #icon><IconEpDownload /></template>
        选择导出
      </el-button>
      <el-button v-if="buttonAuth[EXPORT_BUTTON]" class="!m-0" type="primary" @click="exportAll(false)">
        <template #icon><IconEpDownload /></template>
        全部导出
      </el-button>
      <el-button v-if="buttonAuth[CREATE_BUTTON]" class="!m-0" type="primary" @click="onEdit()">
        <template #icon><IconEpPlus/></template>
        新增
      </el-button>
    </div>
  </div>
  <div class="h-full-29 bg-white px-5 overflow-hidden relative">
    <Table :data="tableData" :columns="tableHeader"   @selection-change="addComList" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
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
    <p class="absolute bottom-5 left-5 text-sm text-black-300" >报销总金额：{{formatCNY(applyAmount) }}</p>

  </div>
  <Edit ref="editRef" @ok="fetchData()" />
  <Detail ref="detailRef" />
</template>

<script setup>
import { MAIN_TYPE, SUB_TYPE, tableHeader } from './config.js'
import Edit from './Edit.vue'
import Detail from './Detail.vue'
import { CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON, EXPORT_BUTTON } from '@/constant/index.js'
const { caseInfo } = storeToRefs(useCaseStore())
const { buttonAuth } = useButtonAuth([CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON, EXPORT_BUTTON], caseInfo.value.isEdit)
const { formatCNY } = useFormatMoney()

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
const time = ref()
const applyAmount = ref()

// 查询
fetchData()
async function fetchData(pageNum = 1) {
  if (time.value) {
    search.startTime = time.value[0]
    search.endTime = time.value[1]
  } else {
    search.startTime = ''
    search.endTime = ''
  }
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
  if (tableData.list.length > 0) {
    applyAmount.value = tableData.list[0].amountCount
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
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = '付款列表' // 下载后文件名
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
