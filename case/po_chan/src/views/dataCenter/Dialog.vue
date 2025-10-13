<template>
  <el-dialog v-model="visible" :title="title" :before-close="beforClose" width="70%" top="10vh">
    <div class="h-125">
      <Table
        v-if="visible"
        :data="tableData"
        :columns="columns"
        :show-summary="['RDJE', 'JETJ', 'ZAJJE'].includes(flag)"
        :summary-method="getSummaries"
        @fetchData="getList"
        @sizeChange="tableData.pageSize = $event; getList()">
        <template #confirmTotal="scope">
          {{ formatCNY(yuanToWanyuan(scope.row.confirmTotal)) + '万元' }}
        </template>
        <template #status="scope">
          {{ statusDict[scope.row.status] || '-' }}
        </template>
      </Table>
    </div>
  </el-dialog>
</template>

<script setup>
const { yuanToWanyuan, formatCNY } = useFormatMoney()
/**
 * @flag
 * AJZT 案件状态
 * RDJE 认定金额
 * JETJ 金额统计
 * ZAJS 总案件数
 * ZAJJE 案件总金额
 */
const flag = ref('')
const visible = ref(false)
const params = ref({})
defineExpose({ params, visible, flag })

const statusDict = {
  2: '进行中',
  3: '已删除',
  9: '已结案',
  '-3': '彻底删除',
}

const title = computed(() => {
  switch (flag.value) {
    case 'AJZT':
      return '案件状态'
    case 'RDJE':
      return '认定金额'
    case 'JETJ':
      return '金额统计'
    case 'ZAJS':
      return '总案件数'
    case 'ZAJJE':
      return '案件总金额'
    default:
      return '-'
  }
})
const columns = computed(() => {
  if (['AJZT', 'ZAJS'].includes(flag.value)) {
    return [
      { type: 'index', label: '序号', width: 80 },
      { prop: 'caseNumber', label: '案号' },
      { prop: 'caseName', label: '案件名称' },
      { prop: 'flowStageName', label: '案件阶段' },
      { prop: 'courtName', label: '受理法院' },
      { prop: 'companyName', label: '管理人' },
      { prop: 'procedureName', label: '破产程序' },
      { prop: 'status', label: '案件状态' },
    ]
  } else if (['RDJE', 'JETJ', 'ZAJJE'].includes(flag.value)) {
    return [
      { type: 'index', label: '序号', width: 80 },
      { prop: 'caseNumber', label: '案号' },
      { prop: 'caseName', label: '案件名称' },
      { prop: 'flowStageName', label: '案件阶段' },
      { prop: 'courtName', label: '受理法院' },
      { prop: 'companyName', label: '管理人' },
      { prop: 'procedureName', label: '破产程序' },
      { prop: 'confirmTotal', label: '案件金额' },
      { prop: 'status', label: '案件状态' },
    ]
  } else {
    return []
  }
})

const { fetchData, tableData } = useTable()
watch(visible, bool => bool && getList())
function getList(pageNum = 1) {
  fetchData({
    api: getDataCenterNext,
    pageNum,
    params: params.value,
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
    } else if (cur.property === 'confirmTotal') {
      acc[ind] = formatCNY(yuanToWanyuan(data.reduce((a, c) => a + Number(c[cur.property]), 0))) + '万元'
    } else {
      acc[ind] = '-'
    }
    return acc
  }, [])
}
</script>
