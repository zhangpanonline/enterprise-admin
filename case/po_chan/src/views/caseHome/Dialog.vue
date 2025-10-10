<template>
  <el-dialog v-model="visible" :title="title" :before-close="beforClose" width="70%" top="10vh">
    <div class="h-125">
      <Table
        :data="tableData"
        :columns="columns"
        :show-summary="!['manager'].includes(flag)"
        :summary-method="getSummaries"
        @fetchData="getList"
        @sizeChange="tableData.pageSize = $event; getList()">
        <template #sex="{ row }">
          {{ row['sex'] === '0' ? '男' : (row['sex'] === '1' ? '女' : '-') }}
        </template>
        <template #total="{ row }">
          {{ formatCNY(row['total']) }}
        </template>
        <template #confirmTotal="{ row }">
          {{ formatCNY(row['confirmTotal']) }}
        </template>
        <template #respiteTotal="{ row }">
          {{ formatCNY(row['respiteTotal']) }}
        </template>
        <template #noConfirmTotal="{ row }">
          {{ formatCNY(row['noConfirmTotal']) }}
        </template>
      </Table>
    </div>
  </el-dialog>
</template>

<script setup>
const { yuanToWanyuan, formatCNY } = useFormatMoney()
/**
 * @flag
 * manager 管理人成员
 * creditor 债权人数量
 * report 申报数量
 * SBTJ 申报统计
 * SDZT 审定状态
 * ZQYY 债权异议
 * ZQRD 债权认定
 * SBZQZE 申报债权总额（万元）
 * SDZQZE 审定债权总额（万元）
 */
const flag = ref('')
const visible = ref(false)
const params = ref({})
defineExpose({ params, visible, flag })

const title = computed(() => {
  switch (flag.value) {
    case 'manager':
      return '管理人成员'
    case 'creditor':
      return '债权人数量'
    case 'report':
      return '申报数量'
    case 'SBZQZE':
      return '申报债权总额'
    case 'SDZQZE':
      return '审定债权总额'
    case 'SBTJ':
      return '申报统计'
    case 'SDZT':
      return '审定状态'
    case 'ZQYY':
      return '债权异议'
    case 'ZQRD':
      return '债权认定'
    default:
      return '-'
  }
})
const api = computed(() => {
  switch (flag.value) {
    case 'manager':
      return getCaseManagerApi
    case 'creditor':
      return getCaseHomeCardNext
    case 'report':
      return getCaseHomeCardNext
    case 'SBZQZE':
      return getCaseHomeCardNext
    case 'SDZQZE':
      return getCaseHomeCardNext
    case 'SBTJ':
      return getCaseHomeNext
    case 'SDZT':
      return getCaseHomeNext
    case 'ZQYY':
      return getCaseHomeNext
    case 'ZQRD':
      return getCaseHomeNext
    default:
      return '-'
  }
})
const columns = computed(() => {
  const repeatUse = [
    { type: 'index', label: '序号', width: 80 },
    { prop: 'creditorName', label: '债权人名称' },
    { prop: 'creditorType', label: '债权人类型' },
    { prop: 'total', label: '申报总额' },
    { prop: 'reviewerChineseName', label: '审查负责人' },
  ]
  switch (flag.value) {
    case 'manager':
      return [
        { type: 'index', label: '序号', width: 80 },
        { prop: 'chineseName', label: '姓名' },
        { prop: 'phone', label: '手机号' },
        { prop: 'sex', label: '性别' },
        { prop: 'roleName', label: '职位' },
      ]
    case 'creditor':
      return repeatUse
    case 'report':
      return repeatUse
    case 'SBZQZE':
      return repeatUse
    case 'SDZQZE':
      return [
        ...repeatUse,
        { prop: 'confirmTotal', label: '审定债权总额' },
      ]
    case 'SBTJ':
      return [
        ...repeatUse,
        { prop: 'confirmTotal', label: '审定债权总额' },
        { prop: 'natureOneName', label: '认定债权性质' },
      ]
    case 'SDZT':
      return [
        ...repeatUse,
        { prop: 'confirmTotal', label: '审定债权总额' },
        { prop: 'natureOneName', label: '认定债权性质' },
        { prop: 'statusName', label: '审定状态' },
      ]
    case 'ZQYY':
      return [
        ...repeatUse,
        { prop: 'confirmTotal', label: '审定债权总额' },
        { prop: 'natureOneName', label: '认定债权性质' },
      ]
    case 'ZQRD':
      return [
        ...repeatUse,
        { prop: 'confirmTotal', label: '审定债权总额' },
        { prop: 'noConfirmTotal', label: '不予确认金额' },
        { prop: 'respiteTotal', label: '暂缓确认金额' },
      ]
    default:
      return []
  }
})

const { fetchData, tableData } = useTable()
watch(visible, bool => bool && getList())
function getList(pageNum = 1) {
  fetchData({
    api: api.value,
    pageNum,
    params: params.value,
    callback() {
      if (api.value === getCaseHomeCardNext) {
        tableData.list.forEach(v => {
          v.creditorName = v.createUser
        })
      }
    },
  })
}
function beforClose(done) {
  visible.value = false
  tableData.list = []
  tableData.total = 0
  tableData.pageNum = 1
  params.value = {}
  done()
}
// 求和
function getSummaries({ columns, data }) {
  return columns.reduce((acc, cur, ind) => {
    if (ind === 0) {
      acc[ind] = '合计'
    } else if (['total', 'confirmTotal', 'noConfirmTotal', 'respiteTotal'].includes(cur.property)) {
      acc[ind] = formatCNY(yuanToWanyuan(data.reduce((a, c) => a + Number(c[cur.property]), 0))) + '万元'
    } else {
      acc[ind] = '-'
    }
    return acc
  }, [])
}
</script>
