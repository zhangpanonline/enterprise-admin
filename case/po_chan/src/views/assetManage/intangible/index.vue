<template>
  <div class="cus_page_header">
    无形资产
  </div>
  <el-header class="bg-white flex items-center justify-between" >
    <div class="flex gap-5 justify-start items-center">
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
    </div>
    <div class="flex gap-5" >
      <el-button class="!m-0" type="primary"  @click="exportTemplate">
            <template #icon><IconEpDownload /></template>
            导入模板
      </el-button>
      <el-upload
            ref="upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="fileUpload"
            action="string"
          >
          <template #trigger>
            <el-button class="!m-0" type="primary" >
            <template #icon><IconEpDownload /></template>
            导入
          </el-button>
          </template>
         </el-upload>
         <el-button type="primary" @click="exportAll(true)">
        <template #icon><IconEpDownload /></template>
        选择导出
      </el-button>
        <el-button class="!m-0" type="primary"  @click="exportAll(false)">
          <template #icon><IconEpDownload /></template>
          全部导出
        </el-button>
      <el-button class="!m-0" type="primary" v-if="caseInfo.isEdit" @click="onEdit()">
        <template #icon><IconEpPlus/></template>
        新增
      </el-button>
    </div>
  </el-header>
  <div class="h-full-29 bg-white px-5 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @selection-change="addComList" @fetchData="fetchData" @sizeChange="tableData.pageSize = $event; fetchData()"  >
      <template #assetsAmount="scope">
        {{ formatCNY(scope.row.assetsAmount) }}
      </template>
      <template #caozuo="scope">
        <div class="flex gap-3">
          <span class="text-primary cursor-pointer " @click="onEdit(scope.row, true)"> 查看</span>
          <span v-if="caseInfo.isEdit" class="text-primary cursor-pointer"  @click="onEdit(scope.row)"> 编辑</span>
          <span v-if="caseInfo.isEdit" class="text-warning cursor-pointer"  @click="onDel(scope.row)"> 删除</span>
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
const { caseInfo } = storeToRefs(useCaseStore())
const { formatCNY } = useFormatMoney()
const tableHeader = [
{ type: 'selection' },
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
  editRef.value.form.projectId = caseInfo.value.projectId
  editRef.value.form.createUser = useAppStore().userInfo.userId
  if (row) {
    editRef.value.form.id = row.id
  }
  if (isLook) {
    detailRef.value.form.projectId = caseInfo.value.projectId
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
  const params = { ...search, projectId: caseInfo.value.projectId, pageNum, pageSize: tableData.pageSize }
  if (search.date) {
    params.date = useDateFormat(search.date, 'YYYY-MM-DD').value
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

// 模版导出
const exportTemplate = async() => {

  const res = await expInvisibleTemplate()
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = '资产模版' // 下载后文件名
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
        type: '1',
        subType: '1',
        ids: ids.value,
        projectId: caseInfo.value.projectId,
      }
    } else {
      ElMessage.error({ message: '请选择要导出的信息', showClose: false })
      return
    }
  } else {
    params = {
      type: '1',
      subType: '1',
      projectId: caseInfo.value.projectId,
    }
  }
  const res = await expAssetsInvisible(params)
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)

  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = '资产列表' // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
const fileUpload = (rawFile) => {

}

const beforeAvatarUpload = async(rawFile) => {
  const formData = new FormData()
  formData.append('file', rawFile)
  formData.append('projectId', caseInfo.value.projectId)
  const res = await impAssetsInvisible(formData)
  if (res.success) {
    fetchData()
  } else {
    ElMessage.error({ message: res.msg, showClose: false })
  }
}
const ids = ref()
const addComList = (val) => {
  console.log(val)
  ids.value = val.map((item, index) => {
    return item.id
  })
}
</script>
