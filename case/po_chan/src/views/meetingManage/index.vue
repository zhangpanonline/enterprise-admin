<!--项目列表-->
<template>
  <div class="cus_page_header">
    {{ $route.meta.title }}
  </div>
  <div class="h-full-14 bg-white">
    <ul class="h-15 flex justify-between items-center px-5">
      <li>
        <el-input v-model="search" placeholder="搜索会议名称" class="cus_search" clearable size="mini" suffix-icon="el-icon-search" @input="fetchList(1)" />
        <el-button class="ml-5" type="primary" @click="fetchList(1)">
          <template #icon><IconEpSearch/></template>
          查询
        </el-button>
      </li>
      <li>
        <el-button v-if="buttonAuth[CREATE_BUTTON]" size="mini" type="primary" @click="onCreate()">
          <template #icon>
            <ElIcon>
              <IconEpPlus />
            </ElIcon>
          </template>
          新增会议
        </el-button>
      </li>
    </ul>
    <div class="h-full-15 px-5 box-border">
      <Table :data="tableData" :columns="tableColumns">
        <template #caozuo="scope" >
          <span class="text-primary cursor-pointer" @click="onEdit(scope.row)" >查看</span>
        </template>
      </Table>
    </div>
    <el-dialog v-model="modal.visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" title="新增会议" width="500px" top="20vh">
      <el-form ref="formRef" :model="modal.form" :rules="modal.rules" inline size="mini">
        <el-form-item label="会议名称" prop="meetName">
          <el-input v-model="modal.form.meetName" style="width: 350px;" />
        </el-form-item>
        <el-form-item label="会议时间" prop="meetTime">
          <el-date-picker v-model="modal.form.meetTime" placeholder="请选择会议时间" :picker-options="{ disabledDate: firstMeetingDateDisabled }" style="width: 350px;" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <div class="pt-5 text-right">
        <el-button size="mini" @click="onCancel()">取消</el-button>
        <el-button :loading="modal.loading" size="mini" type="primary" @click="onSave()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { CASE_EDIT_TABLE_KEY, CREATE_BUTTON } from '@/constant'
const router = useRouter()
const { caseInfo } = storeToRefs(useCaseStore())
const { buttonAuth } = useButtonAuth([CREATE_BUTTON], caseInfo.value.isEdit)
const search = ref('')
const formRef = ref(null)
const tableColumns = [
  { label: '会议名称', prop: 'meetName' },
  { label: '会议时间', prop: 'meetName' },
  // 0 未开始；2 进行中；9 已结束；-3 彻底删除
  { label: '会议时间', prop: 'statusName' },
  { label: '创建者', prop: 'createUserName' },
  { label: '操作', prop: 'caozuo' },
]
const modal = reactive({
  visible: false,
  form: {
    meetName: '',
    meetTime: '',
  },
  rules: {
    meetName: [{ required: true, message: '会议名称不能为空！' }],
    meetTime: [{ required: true, message: '会议时间不能为空！' }],
  },
  loading: false,
})
const { tableData, fetchData } = useTable()
// 判断缓存中是否存在当前页面状态
init()
function init() {
  // TODO 清空
  const meetQueryStr = window.localStorage.getItem(CASE_EDIT_TABLE_KEY)
  if (meetQueryStr) {
    const params = JSON.parse(meetQueryStr)
    tableData.pageNum = params.pageNum || tableData.pageNum
    search.value = params.search || search.value
    fetchList(params.pageNum)
  } else {
    fetchList()
  }
}
// 表格数据
function fetchList(pageNum = 1) {
  fetchData({
    api: meetFindPageApi,
    pageNum,
    params: {
      projectId: caseInfo.value.projectId,
      meetName: search.value,
    },
  })
}
function onCreate() {
  modal.visible = true
  modal.form.meetName = caseInfo.value.caseName + `第${toChinesNum(tableData.total + 1)}次债权人会议`
}
function toChinesNum(num) {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) noWan = '0' + noWan
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
function onCancel() {
  modal.visible = false
  modal.form.meetName = caseInfo.value.caseName + '第一次债权人会议'
  modal.form.meetTime = ''
}
// 新增会议
async function onSave() {
  const validate = await formRef.value.validate()
  if (!validate) return false
  try {
    modal.loading = true
    const res = await meetModifyApi({ ...modal.form, projectId: caseInfo.value.projectId })
    if (res.success) {
      ElMessage.success('操作成功！')
      onCancel()
      fetchList()
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message })
  } finally {
    modal.loading = false
  }
}
// 今天之前日期不可选择
function firstMeetingDateDisabled(date) {
  const cur = Date.now() - 24 * 3600 * 1000
  const start = new Date(date).getTime()
  return start < cur
}
function onEdit(row) {
  localStorage.setItem(CASE_EDIT_TABLE_KEY, JSON.stringify({ pageNum: tableData.pageNum, search: search.value }))
  router.push({ path: '/meetingManage', query: { row: JSON.stringify(row), case: JSON.stringify(caseInfo.value) }})
}
</script>
