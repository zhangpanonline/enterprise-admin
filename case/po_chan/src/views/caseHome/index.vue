<template>
  <div class="!bg-undertone" v-loading="loading" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.9)" >
    <div class="bg-white shadow h-27.5 rounded box-border relative flex justify-around flex-col mb-3 p-5" >
      <!-- 当前案件名称 -->
      <el-dropdown trigger="click" @command="changeCompany" @visible-change="dropdownShow = $event" placement="bottom-start">
        <span class="text-black text-lg cursor-pointer">
          {{ caseInfo.caseName || '-' }}
          <el-icon>
            <IconEpCaretTop v-if="dropdownShow" />
            <IconEpCaretBottom v-else />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="v in caseList" :disabled="caseInfo.projectId === v.projectId" :key="v.projectId" :command="v.projectId" >{{ v.caseName }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 当前案件基本信息 -->
      <ul class="flex justify-start gap-5" >
        <li>
          <span class="text-sm text-black-150 mr-3" >受理破产裁定文书号</span>
          <span class="text-sm text-black-300" >{{ caseInfo['liquidationOrderFileNumber'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >受理法院</span>
          <span class="text-sm text-black-300" >{{ caseInfo['courtName'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >破产程序</span>
          <span class="text-sm text-black-300" >{{ caseInfo['procedure'] || '-' }}</span>
        </li>
        <li>
          <span class="text-sm text-black-150 mr-3" >申报时间</span>
          <span class="text-sm text-black-300" >{{ caseInfo['declareStartDate'] || '-' }}</span>
        </li>
      </ul>
      <el-button class="absolute right-5 !border-primary !text-primary" type="default" plain @click="onGoCase()">
        进入案件
        <ElIcon class="ml-1" >
          <IconEpRight />
        </ElIcon>
      </el-button>
    </div>
    <ul class="content" >
      <li class="item1 p-5 cursor-pointer" @click="onOpenDialog('manager')" >
        <img src='/src/assets/images/home_icon1.png' />
        <p class="content__grid" >
          <span class="content__grid__label" >管理人成员</span>
          <span class="content__grid__value" >{{ caseInfo.managerCount || '-' }}</span>
        </p>
      </li>
      <li class="item2 p-5 cursor-pointer" @click="onOpenDialog('creditor')" >
        <img src='@/assets/images/home_icon2.png' />
        <p class="content__grid" >
          <span class="content__grid__label" >债权人数量</span>
          <span class="content__grid__value" >{{ caseInfo.creditorCount || '-' }}</span>
        </p>
      </li>
      <li class="item3 p-5 cursor-pointer" @click="onOpenDialog('report')" >
        <img src='@/assets/images/home_icon3.png' />
        <p class="content__grid" >
          <span class="content__grid__label" >申报数量（笔）</span>
          <span class="content__grid__value" >{{ caseInfo.moneyCount || '-' }}</span>
        </p>
      </li>
      <li class="item4 p-5 cursor-pointer" @click="onOpenDialog('SBZQZE')" >
        <img src='@/assets/images/home_icon4.png'/>
        <p class="content__grid" >
          <span class="content__grid__label" >申报债权总额（万元）</span>
          <span class="content__grid__value" >{{ formatCNY(yuanToWanyuan(caseInfo.moneyTotal)) }}</span>
        </p>
      </li>
      <li class="item5 p-5 cursor-pointer" @click="onOpenDialog('SDZQZE')" >
        <img src='@/assets/images/home_icon5.png'/>
        <p class="content__grid" >
          <span class="content__grid__label" >审定债权总额（万元）</span>
          <span class="content__grid__value" >{{ formatCNY(yuanToWanyuan(caseInfo.confirmMoneyTotal)) }}</span>
        </p>
      </li>
      <li class="item6" >
        <p class="content__title" >申报统计</p>
        <div class="content__chart" ref="chart1" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </li>
      <li class="item7" >
        <p class="content__title" >债权异议</p>
        <div class="content__chart" ref="chart2" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </li>
      <li class="item8" >
        <p class="content__title" >审定状态</p>
        <div class="content__chart" ref="chart3" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </li>
      <li class="item9" >
        <p class="content__title" >债权认定</p>
        <div class="content__chart" ref="chart4" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </li>
    </ul>
    <Dialog ref="dialogRef"></Dialog>
  </div>
</template>

<script setup>
import echarts from '@/plugins/echarts.js'
import Dialog from './Dialog.vue'
const tooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'none',
  },
}
const grid = {
  top: 30,
  left: 20,
  right: 20,
  bottom: 30,
}
const yAxis = { show: false }
const xAxis = {
  axisLine: { show: false },
  axisTick: { show: false },
}
const textStyle = {
  color: '#333',
  fontSize: 14,
  fontWeight: 'normal',
  padding: 20,
}
const appStore = useAppStore()
const caseStore = useCaseStore()
const router = useRouter()
const { formatCNY, yuanToWanyuan } = useFormatMoney()
const loading = ref(false)
const dropdownShow = ref(false)
const caseInfo = reactive({})
const caseList = ref([])
const dialogRef = ref(null)
const chart1 = ref(null)
const chart2 = ref(null)
const chart3 = ref(null)
const chart4 = ref(null)
let chartInstance1 = null
let chartInstance2 = null
let chartInstance3 = null
let chartInstance4 = null

onMounted(() => {
  getCaseTotal()
  getCaseList()
})
function onOpenDialog(flag) {
  switch (flag) {
    case 'manager':
      dialogRef.value.params.companyType = '3fda4fd73fb14834b26076c1af439b60'
      dialogRef.value.params.companyId = appStore.userInfo.companyId
      break
    case 'creditor':
      dialogRef.value.params.queryType = 1
      break
    case 'report':
      dialogRef.value.params.queryType = 2
      break
    case 'SBZQZE':
      dialogRef.value.params.queryType = 3
      break
    case 'SDZQZE':
      dialogRef.value.params.queryType = 4
      break
  }
  dialogRef.value.params.projectId = caseInfo.projectId
  dialogRef.value.flag = flag
  dialogRef.value.visible = true
}
// 进入案件详情
function onGoCase() {
  caseStore.getCaseInfo(caseInfo.projectId)
  router.push({ path: '/caseManage/info' })
}
// 获取当前用户名下有多少个案件
async function getCaseTotal() {
  try {
    const res = await getCaseTotalApi()
    if (res.success) {
      appStore.setCaseTotal(res.data)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  }
}
// 获取当前登录用户的案件列表
async function getCaseList() {
  try {
    loading.value = true
    const res = await getChangeCaseListApi()
    if (res.success) {
      caseList.value = res.data
      if (Array.isArray(caseList.value) && caseList.value.length > 0) {
        changeCompany(caseList.value[0]['projectId'])
      }
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading.value = false
  }
}
function changeCompany(id) {
  Object.assign(caseInfo, caseList.value.find(v => v.projectId === id) || {})
  getCaseInfo(id)
}
async function getCaseInfo(id) {
  try {
    loading.value = true
    const res = await getCaseHome(id)
    if (res.success) {
      Object.assign(caseInfo, res.data)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading.value = false
    if (!chartInstance1) {
      chartInstance1 = echarts.init(chart1.value)
    } else {
      chartInstance1.clear()
      chartInstance1.off('click')
    }
    if (!chartInstance2) {
      chartInstance2 = echarts.init(chart2.value)
    } else {
      chartInstance2.clear()
      chartInstance2.off('click')
    }
    if (!chartInstance3) {
      chartInstance3 = echarts.init(chart3.value)
    } else {
      chartInstance3.clear()
      chartInstance3.off('click')
    }
    if (!chartInstance4) {
      chartInstance4 = echarts.init(chart4.value)
    } else {
      chartInstance4.clear()
      chartInstance4.off('click')
    }
    drawChart1()
    drawChart2()
    drawChart3()
    drawChart4()
  }
}
function drawChart1() {
  let source = [
    ['data', '申报总额（万元）', '审定总额（万元）'],
    ['普通债权', '0.00', '0.00'],
    ['税款债权', '0.00', '0.00'],
    ['职工债权', '0.00', '0.00'],
    ['抵押债权', '0.00', '0.00'],
    ['质押债权', '0.00', '0.00'],
    ['留置债权', '0.00', '0.00'],
    ['工程款债权', '0.00', '0.00'],
    ['其他债权', '0.00', '0.00'],
  ]
  if (caseInfo.creditorApplyAndConfirmMoneyCount) {
    source = caseInfo.creditorApplyAndConfirmMoneyCount.map((v, i) => {
      if (i > 0) {
        v.forEach((_, ind) => {
          if (ind > 0) v[ind] = yuanToWanyuan(v[ind], 2)
        })
      }
      return v
    })
  }
  chartInstance1.setOption({
    legend: {
      right: '12px',
    },
    grid,
    tooltip,
    dataset: { source },
    xAxis: { type: 'category', ...xAxis },
    yAxis,
    series: [
      { type: 'bar', color: '#6FA5E3', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#D89667', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
    ],
  })
  chartInstance1.on('click', e => {
    const natureType = {
      '申报总额（万元）': 1,
      '审定总额（万元）': 2,
    }
    dialogRef.value.params = {
      projectId: caseInfo.projectId,
      // 1=申报统计、3=债权异议、2=审核状态、4=债权认定
      queryType: 1,
      natureOne: e.name,
      // 1=申报总额、2=审定总额
      natureType: natureType[e.seriesName],
    }
    dialogRef.value.flag = 'SBTJ'
    dialogRef.value.visible = true
  })
}
function drawChart2() {
  let source = [
    ['data', '未回复', '已回复'],
    ['企业', '0', '0'],
    ['个人', '0', '0'],
    ['职工', '0', '0'],
  ]
  if (caseInfo.creditorTypeAndOpinionCount) {
    source = caseInfo.creditorTypeAndOpinionCount
  }
  chartInstance2.setOption({
    legend: {
      right: '12px',
    },
    grid,
    tooltip,
    dataset: { source },
    xAxis: { type: 'category', ...xAxis },
    yAxis,
    series: [
      { type: 'bar', color: '#EDEDED', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#6FA5E3', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
    ],
  })
  chartInstance2.on('click', e => {
    const natureType = {
      '未回复': 1,
      '已回复': 2,
    }
    const creditorType = {
      '个人': 'd041727271c04dacb0a30e1b2249a662',
      '企业': 'f2ec849da47d407ebb4201db8a59039e',
      '职工': 'd388331d86c14674bde67935c6cd4609',
    }
    dialogRef.value.params = {
      projectId: caseInfo.projectId,
      // 1=申报统计、3=债权异议、2=审核状态、4=债权认定
      queryType: 3,
      natureType: natureType[e.seriesName],
      creditorType: creditorType[e.name],
    }
    dialogRef.value.flag = 'ZQYY'
    dialogRef.value.visible = true
  })
}
function drawChart3() {
  let source = [
    ['data', '已审定', '审定中', '通过形审', '驳回形审', '待审定'],
    ['企业', '0', '0', '0', '0', '0'],
    ['个人', '0', '0', '0', '0', '0'],
    ['职工', '0', '0', '0', '0', '0'],
  ]
  if (caseInfo.creditorTypeAndStatusCount) {
    source = caseInfo.creditorTypeAndStatusCount
  }
  chartInstance3.setOption({
    legend: {
      right: '12px',
    },
    grid,
    title: { text: '数量（个）：' + caseInfo.moneyCount, textStyle, left: '12px' },
    tooltip,
    dataset: { source },
    xAxis: { type: 'category', ...xAxis },
    yAxis,
    series: [
      { type: 'bar', color: '#6FA5E3', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#D36E5D', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#91CC63', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#D89667', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
      { type: 'bar', color: '#E9CC70', barMaxWidth: 20, showBackground: true, backgroundStyle: { color: '#fafafa' }},
    ],
  })
  chartInstance3.on('click', e => {
    const creditorType = {
      '个人': 'd041727271c04dacb0a30e1b2249a662',
      '企业': 'f2ec849da47d407ebb4201db8a59039e',
      '职工': 'd388331d86c14674bde67935c6cd4609',
    }
    const status = {
      '待申报': -1,
      '待审定': 0,
      '审定中': 2,
      '驳回形审': 5,
      '通过形审': 7,
      '已审定': 9,
    }
    dialogRef.value.params = {
      projectId: caseInfo.projectId,
      // 1=申报统计、3=债权异议、2=审核状态、4=债权认定
      queryType: 2,
      creditorType: creditorType[e.name],
      status: status[e.seriesName],
    }
    dialogRef.value.flag = 'SDZT'
    dialogRef.value.visible = true
  })
}
function drawChart4() {
  let obj = { '暂缓总额': '0.00', '认定总额': '0.00', '不予确认总额': '0.00' }
  const data = []
  if (caseInfo.respiteAndNoConfirmTotalMap) {
    obj = caseInfo.respiteAndNoConfirmTotalMap
  }
  for (const key in obj) {
    data.push({ value: yuanToWanyuan(obj[key], 2), name: `${key}` })
  }
  chartInstance4.setOption({
    legend: {
      top: 'middle',
      orient: 'vertical',
      left: '70%',
    },
    tooltip: { ...tooltip, trigger: 'item' },
    color: ['#6FA5E3', '#D36E5D', '#91CC63', '#D89667', '#E9CC70'],
    title: { text: '申报总额（万元）：' + yuanToWanyuan(caseInfo.moneyTotal, 2), textStyle, left: '12px' },
    series: [
      {
        name: '债权认定',
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data,
      },
    ],
  })
  chartInstance4.on('click', e => {
    const natureType = {
      '暂缓总额': 1,
      '认定总额': 2,
      '不予确认总额': 3,
    }
    dialogRef.value.params = {
      projectId: caseInfo.projectId,
      // 1=申报统计、3=债权异议、2=审核状态、4=债权认定
      queryType: 4,
      natureType: natureType[e.name],
    }
    dialogRef.value.flag = 'ZQRD'
    dialogRef.value.visible = true
  })
}
</script>

<style scoped>
.content {
  height: calc(100% - 120px);
  display: grid;
  grid-template-columns: repeat(3, 2fr) repeat(2, 3fr);
  grid-template-rows: 1fr repeat(2, 2fr);
  /* grid-template-rows: 106px 276px 276px; */
  gap: 12px;

}

.content > li {
  background: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  box-shadow: 0 0 5px #ededed;
}

.item1 { grid-area: 1 / 1 / 2 / 2; }
.item2 { grid-area: 1 / 2 / 2 / 3; }
.item3 { grid-area: 1 / 3 / 2 / 4; }
.item4 { grid-area: 1 / 4 / 2 / 5; }
.item5 { grid-area: 1 / 5 / 2 / 6; }
.item6 { grid-area: 2 / 1 / 3 / 4; }
.item7 { grid-area: 3 / 1 / 4 / 4; }
.item8 { grid-area: 2 / 4 / 3 / 6; }
.item9 { grid-area: 3 / 4 / 4 / 6; }
.item1, .item2, .item3, .item4, .item5 {
      display: flex;
      justify-content: flex-start;
      gap: 12px;
      align-items: center;
}
@media screen and (max-width: 1400px) {
  .content{
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow: auto;
  }
  .item1, .item2, .item3 {
    width: 32%;
  }
  .item4,.item5{
    width: 49%;
  }
  .item6,.item7,.item8,.item9{
    width: 100%;
    height: 280px;
  }
}
.content__grid {
  height: 100%;
  justify-content: center;
  display: flex;
  gap: 15px;
  flex-direction: column;
}
.content__grid > span {
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
.content__grid__label {
  color: #666;
  font-size: 14px;
}
.content__grid__value {
  color: #1D2129;
  font-size: 20px;
}
.content__title {
  font-size: 16px;
  font-family: Source Han Sans-Medium, Source Han Sans;
  font-weight: 500;
  color: #333333;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  padding-left: 20px;
  border-bottom: 1px solid #F2F2F2;
  position: relative;
}
.content__title::after {
  content: '';
  width: 2em;
  height: 2px;
  background: #D11A2D;
  position: absolute;
  left: calc(20px + 1em);
  bottom: -1px;
  border-radius: 2px;
}
.content__chart {
  height: calc(100% - 50px);
  position: relative;
  margin-top: 8px;
}
</style>
