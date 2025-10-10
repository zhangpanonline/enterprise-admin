<template>
  <div class="cus_page_header ">
    {{ $route.meta.title }}
  </div>
  <el-header class="bg-white flex items-center justify-between" >
    <div class="flex gap-5 justify-start items-center">
    <el-input v-model="search.assetsName" placeholder="请输入名称" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-select v-model="search.assetsModel" placeholder="请选择账簿类型" clearable class="cus_search" @change="fetchData()">
      <el-option v-for="v in assetsStatusDict" :value="v.value" :label="v.label" :key="v.value"></el-option>
    </el-select>
    <el-input v-model="search.chineseName" placeholder="请输入登记人" class="cus_search" clearable @change="fetchData()"></el-input>
    <el-button type="primary" @click="fetchData()">
      <template #icon><IconEpSearch/></template>
      查询
    </el-button>
    </div>
    <div class="flex gap-5" >
      <el-button v-if="buttonAuth[IMPORT_BUTTON]" class="!m-0" type="primary" @click="exportTemplate">
        <template #icon><IconEpDownload /></template>
        导入模板
      </el-button>
      <el-upload
        ref="upload"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="fileUpload"
        action="string">
        <template #trigger>
          <el-button v-if="buttonAuth[IMPORT_BUTTON]" class="!m-0" type="primary" >
            <template #icon><IconEpDownload /></template>
            导入
        </el-button>
        </template>
      </el-upload>
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
  </el-header>
  <div class="h-full-29 bg-white px-5 overflow-hidden relative">
    <Table :data="tableData" :columns="tableHeader" @selection-change="addComList" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
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
import { CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON, IMPORT_BUTTON, EXPORT_BUTTON } from '@/constant/index.js'
const { caseInfo } = storeToRefs(useCaseStore())
const { buttonAuth } = useButtonAuth([CREATE_BUTTON, EDIT_BUTTON, DELETE_BUTTON, IMPORT_BUTTON, EXPORT_BUTTON], caseInfo.value.isEdit)
const { other_ledger_assets_model: assetsStatusDict } = useDict('other_ledger_assets_model')
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

const fileUpload = (rawFile) => {

}

const beforeAvatarUpload = async(rawFile) => {
  const formData = new FormData()
  formData.append('file', rawFile)
  formData.append('projectId', caseInfo.value.projectId)
  formData.append('subType', SUB_TYPE)
  formData.append('type', MAIN_TYPE)
  const res = await impAssets(formData)
  if (res.success) {
    fetchData()
  } else {
    ElMessage.error({ message: res.msg, showClose: false })
  }
}
// 模版导出
const exportTemplate = async() => {
  const params = {
    type: MAIN_TYPE,
    subType: SUB_TYPE,
    projectId: caseInfo.value.projectId,

  }
  const res = await expTemplate(params)
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = '账簿模版' // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
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
  downloadElement.download = '账簿列表' // 下载后文件名
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
