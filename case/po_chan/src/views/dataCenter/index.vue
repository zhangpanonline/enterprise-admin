<template>
  <div
    class="!bg-transparent grid gap-3 w-full overflow-x-hidden overflow-y-auto
    md:grid-rows-[80px_minmax(500px,_1fr)_minmax(500px,_1fr)]
    lg:grid-rows-[80px_minmax(250px,_1fr)_minmax(250px,_1fr)]"
    :class="{ 'grid-rows-[1000px_500px]': isApp }"
    v-loading="loading"
    element-loading-spinner="loading-animation"
    element-loading-background="rgba(255, 255, 255, 0.7)" >
    <div v-if="!isApp" class="bg-white text-lg leading-20 pl-5 font-bold shadow" >
      {{ companyName }}
    </div>
    <div class="shadow bg-white w-full">
      <p class="text-base h-12.5 leading-12.5 box-border pl-5 border-b border-info-50 relative
        after:content-[''] after:w-[2em] after:h-0.5 after:bg-[#D11A2D] after:absolute after:left-5 after:bottom-[-1px] after:rounded-sm" >
        案件数据
        <el-date-picker class="ml-5" v-model="date" type="daterange" :clearable="false" range-separator="-" @change="fetchData()" ></el-date-picker>
      </p>
      <div class="bg-undertone grid gap-0.5
        sm:grid-rows-4
        md:grid-cols-2
        md:grid-rows-2
        lg:grid-cols-4"  style="height: calc(100% - 51px);">
        <div ref="chart1" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading1" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
        <div ref="chart2" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading2" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
        <div ref="chart3" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading1" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
        <div ref="chart4" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading2" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </div>
    </div>
    <div class="shadow bg-white" >
      <p class="text-base h-12.5 leading-12.5 box-border pl-5 border-b border-info-50 relative
        after:content-[''] after:w-[2em] after:h-0.5 after:bg-[#D11A2D] after:absolute after:left-5 after:bottom-[-1px] after:rounded-sm" >
        近期破产案件分析
      </p>
      <div class="bg-undertone grid gap-0.5
        sm:grid-rows-2
        md:grid-rows-2
        lg:grid-cols-2" style="height: calc(100% - 51px);">
        <div ref="chart5" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading3" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
        <div ref="chart6" class="bg-white sm:w-[_calc(100%_-_25px)] w-full h-full p-3" v-loading="loading3" element-loading-spinner="loading-animation" element-loading-background="rgba(255, 255, 255, 0.7)" >
          <div class="w-full h-full cus_empty" ></div>
        </div>
      </div>
    </div>
    <Dialog ref="dialogRef" />
  </div>
</template>
<script setup>
import Dialog from './Dialog.vue'
import dayjs from 'dayjs'
import echarts from '@/plugins/echarts.js'
const legend = { right: '0', bottom: '0', orient: 'vertical' }
const tooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'none',
    lineStyle: {

    },
  },
}
const grid = {
  top: 30,
  left: 20,
  right: 20,
  bottom: 10,
  containLabel: true,
}
const textStyle = {
  color: '#333',
  fontSize: 14,
  fontWeight: 'normal',
  padding: 20,
}

const route = useRoute()

// 当前是否为APP使用
const isApp = computed(() => {
  return route.path.includes('app')
})

const dialogRef = ref(null)

const loading = ref(false)
const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)

const chart1 = ref(null)
const chart2 = ref(null)
const chart3 = ref(null)
const chart4 = ref(null)
const chart5 = ref(null)
const chart6 = ref(null)

let chartInstance1 = null
let chartInstance2 = null
let chartInstance3 = null
let chartInstance4 = null
let chartInstance5 = null
let chartInstance6 = null

const curDate = new Date()
const year = curDate.getFullYear()
const month = curDate.getMonth() + 1
const day = curDate.getDate()
const date = ref([`${year}-${month}-01`, `${year}-${month}-${day}`])
const startTime = computed(() => useDateFormat(date.value[0], 'YYYY-MM-DD').value + ' 00:00:00')
const endTime = computed(() => useDateFormat(date.value[1], 'YYYY-MM-DD').value + ' 23:59:59')

let analyseStartMonth = '0'
let isNewYear = false

// 将元转为万元
const { yuanToWanyuan } = useFormatMoney()

const appStore = useAppStore()
const companyName = computed(() => {
  if (appStore.userInfo && appStore.userInfo.companyName) {
    return appStore.userInfo.companyName
  } else {
    return '--'
  }
})

// 破产程序字典
const bankruptProgram = reactive({})
getBankruptProgram()
async function getBankruptProgram() {
  try {
    const res = await getDictApi({ code: 'bankruptProgram' })
    if (res.success) {
      res.data.forEach(({ id, dictLabel }) => {
        bankruptProgram[dictLabel] = id
      })
    } else {
      console.error(res)
      ElMessage.error('获取破产程序字典失败！')
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
  fetchAnalyse()
})
function fetchData() {
  fetchData1()
  fetchData2()
}
// 获取案件占比、案件状态
async function fetchData1() {
  try {
    loading1.value = true
    const params = {
      startTime: startTime.value,
      endTime: endTime.value,
    }
    const res = await getDataCenter1Api(params, route.query.token)
    // 案件占比、金额统计
    if (res.success) {
      const { statusCountMap, typeCountMap } = res.data
      drawChart1(statusCountMap)
      drawChart3(typeCountMap)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading1.value = false
  }
}
function drawChart1(obj) {
  if (!chartInstance1) {
    chartInstance1 = echarts.init(chart1.value)
  } else {
    chartInstance1.clear()
    chartInstance1.off('click')
  }
  const data = []
  let total = 0
  for (const key in obj) {
    data.push({ value: obj[key], name: `${key}` })
    total += Number(obj[key])
  }
  chartInstance1.setOption({
    legend: {
      ...legend,
      formatter: function(name) {
        return `${name}`
      },
    },
    grid,
    tooltip: { ...tooltip, trigger: 'item' },
    color: ['#FAC858', '#507AFC', '#93BEFF'],
    title: { text: `案件状态（${total}件）`, textStyle },
    series: [
      {
        name: '案件占比',
        type: 'pie',
        radius: '40%',
        center: ['35%', '50%'],
        data,
      },
    ],
  })
  chartInstance1.on('click', e => {
    const status = {
      '进行中': 2,
      '已删除': 3,
      '已结案': 9,
      '彻底删除': -3,
    }
    dialogRef.value.params = {
      startTime: startTime.value,
      endTime: endTime.value,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 1,
      // 1=状态查询、2=破产程序查询
      type: 1,
      status: status[e.name],
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'AJZT'
      dialogRef.value.visible = true
    }
  })
}
function drawChart3(obj) {
  if (!chartInstance3) {
    chartInstance3 = echarts.init(chart3.value)
  } else {
    chartInstance3.clear()
    chartInstance3.off('click')
  }
  const data = []
  let total = 0
  for (const key in obj) {
    data.push({ value: obj[key], name: `${key}` })
    total += Number(obj[key])
  }
  chartInstance3.setOption({
    legend: {
      ...legend,
      formatter: function(name) {
        return `${name}`
      },
    },
    grid,
    tooltip: { ...tooltip, trigger: 'item' },
    color: ['#FAC858', '#507AFC', '#93BEFF'],
    title: { text: `案件状态（${total}件）`, textStyle },
    series: [
      {
        name: '案件状态',
        type: 'pie',
        radius: '40%',
        center: ['35%', '50%'],
        data,
      },
    ],
  })
  chartInstance3.on('click', e => {
    dialogRef.value.params = {
      startTime: startTime.value,
      endTime: endTime.value,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 1,
      // 1=状态查询、2=破产程序查询
      type: 2,
      procedureType: bankruptProgram[e.name],
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'AJZT'
      dialogRef.value.visible = true
    }
  })
}
// 获取认定金额、金额统计
async function fetchData2() {
  try {
    loading2.value = true
    const params = {
      startTime: startTime.value,
      endTime: endTime.value,
    }
    const res = await getDataCenter2Api(params, route.query.token)
    if (res.success) {
      // 认定金额、金额统计
      const { statusMoneyMap, typeMoneyMap } = res.data
      drawChart2(statusMoneyMap)
      drawChart4(typeMoneyMap)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading2.value = false
  }
}
function drawChart2(obj) {
  if (!chartInstance2) {
    chartInstance2 = echarts.init(chart2.value)
  } else {
    chartInstance2.clear()
    chartInstance2.off('click')
  }
  const data = []
  let total = 0
  for (const key in obj) {
    data.push({ value: yuanToWanyuan(obj[key], 2), name: `${key}` })
    total += Number(obj[key])
  }
  chartInstance2.setOption({
    legend: {
      ...legend,
      formatter: function(name) {
        return `${name}`
      },
    },
    grid,
    tooltip: { ...tooltip, trigger: 'item' },
    color: ['#6FA5E3', '#D36E5D', '#91CC63', '#D89667', '#E9CC70'],
    title: { text: '认定金额（' + yuanToWanyuan(total, 2) + '万元）', textStyle },
    series: [
      {
        name: '认定金额',
        type: 'pie',
        radius: ['20%', '40%'],
        center: ['35%', '50%'],
        itemStyle: {
          borderRadius: 8,
        },
        data,
      },
    ],
  })
  chartInstance2.on('click', e => {
    const status = {
      '进行中': 2,
      '已删除': 3,
      '已结案': 9,
      '彻底删除': -3,
    }
    dialogRef.value.params = {
      startTime: startTime.value,
      endTime: endTime.value,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 2,
      // 1=状态查询、2=破产程序查询
      type: 1,
      status: status[e.name],
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'RDJE'
      dialogRef.value.visible = true
    }
  })
}
function drawChart4(obj) {
  if (!chartInstance4) {
    chartInstance4 = echarts.init(chart4.value)
  } else {
    chartInstance4.clear()
    chartInstance4.off('click')
  }
  const data = []
  let total = 0
  for (const key in obj) {
    data.push({ value: yuanToWanyuan(obj[key], 2), name: `${key}` })
    total += Number(obj[key])
  }
  chartInstance4.setOption({
    legend: {
      ...legend,
      formatter: function(name) {
        return `${name}`
      },
    },
    grid,
    tooltip: { ...tooltip, trigger: 'item' },
    color: ['#6FA5E3', '#D36E5D', '#91CC63', '#D89667', '#E9CC70'],
    title: { text: '金额统计（' + yuanToWanyuan(total, 2) + '万元）', textStyle },
    series: [
      {
        name: '金额统计',
        type: 'pie',
        radius: ['20%', '40%'],
        center: ['35%', '50%'],
        itemStyle: {
          borderRadius: 8,
        },
        data,
      },
    ],
  })
  chartInstance4.on('click', e => {
    dialogRef.value.params = {
      startTime: startTime.value,
      endTime: endTime.value,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 2,
      // 1=状态查询、2=破产程序查询
      type: 2,
      procedureType: bankruptProgram[e.name],
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'JETJ'
      dialogRef.value.visible = true
    }
  })
}
// 案件分析
async function fetchAnalyse() {
  try {
    loading3.value = true
    const month = useDateFormat(new Date(dayjs().subtract(5, 'month').startOf('month')), 'YYYY-MM-DD').value
    analyseStartMonth = month.slice(5, 7)
    isNewYear = new Date(month).getFullYear() !== new Date(endTime.value).getFullYear()
    const params = {
      startTime: `${month.slice(0, 7)}-01 00:00:00`,
      endTime: endTime.value,
    }
    const res = await getDataCenter3Api(params, route.query.token)
    if (res.success) {
      // 认定金额、金额统计
      const { monthMoneyList, monthCountList } = res.data
      drawChart5(monthCountList)
      drawChart6(monthMoneyList)
    } else {
      ElMessage.error({ message: res.msg, showClose: false })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message, showClose: false })
  } finally {
    loading3.value = false
  }
}
function drawChart5(list) {
  if (!chartInstance5) {
    chartInstance5 = echarts.init(chart5.value)
  } else {
    chartInstance5.clear()
    chartInstance5.off('click')
  }
  const { keys, values, total } = list.reduce((acc, cur) => {
    acc.keys.push(Object.keys(cur)[0])
    acc.values.push(Object.values(cur)[0])
    acc.total += Number(Object.values(cur)[0])
    return acc
  }, { keys: [], values: [], total: 0 })

  chartInstance5.setOption({
    tooltip: { ...tooltip, trigger: 'axis', axisPointer: { type: 'line' }},
    color: ['#009DB2'],
    title: { text: `总案件：${total}件`, textStyle },
    grid,
    legend: {
      data: ['案件数量（件）'],
      left: 'right',
    },
    xAxis: {
      type: 'category',
      data: keys,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '案件数量（件）',
        data: values,
        type: 'line',
        smooth: true,
      },
    ],
  })
  chartInstance5.on('click', e => {
    const curYear = new Date().getFullYear()
    let year = curYear
    if (isNewYear) {
      year = Number(e.name.slice(0, e.name.length - 1)) >= Number(analyseStartMonth) ? (curYear - 1) : curYear
    }
    const startTime = useDateFormat(`${year}-${e.name.slice(0, e.name.length - 1)}-01`, 'YYYY-MM-DD').value + ' 00:00:00'
    const endTime = useDateFormat(`${year}-${e.name.slice(0, e.name.length - 1)}-${dayjs(new Date(startTime)).daysInMonth()}`, 'YYYY-MM-DD').value + ' 23:59:59'
    dialogRef.value.params = {
      startTime,
      endTime,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 3,
      // 1=状态查询、2=破产程序查询
      type: 1,
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'ZAJS'
      dialogRef.value.visible = true
    }
  })
}
function drawChart6(list) {
  if (!chartInstance6) {
    chartInstance6 = echarts.init(chart6.value)
  } else {
    chartInstance6.clear()
    chartInstance6.off('click')
  }
  const { keys, values, total } = list.reduce((acc, cur) => {
    acc.keys.push(Object.keys(cur)[0])
    const val = Object.values(cur)[0]
    acc.values.push(yuanToWanyuan(val, 2))
    acc.total += Number(val)
    return acc
  }, { keys: [], values: [], total: 0 })
  chartInstance6.setOption({
    legend: {
      data: ['案件金额（万元）'],
      left: 'right',
    },
    grid,
    tooltip: { ...tooltip, trigger: 'axis', axisPointer: { type: 'line' }},
    color: ['#F47A75'],
    title: { text: `总金额：${yuanToWanyuan(total, 2)}万元`, textStyle },
    xAxis: {
      type: 'category',
      data: keys,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '案件金额（万元）',
        data: values,
        type: 'line',
        smooth: true,
      },
    ],
  })
  chartInstance6.on('click', e => {
    const curYear = new Date().getFullYear()
    let year = curYear
    if (isNewYear) {
      year = Number(e.name.slice(0, e.name.length - 1)) >= Number(analyseStartMonth) ? (curYear - 1) : curYear
    }
    const startTime = useDateFormat(`${year}-${e.name.slice(0, e.name.length - 1)}-01`, 'YYYY-MM-DD').value + ' 00:00:00'
    const endTime = useDateFormat(`${year}-${e.name.slice(0, e.name.length - 1)}-${dayjs(new Date(startTime)).daysInMonth()}`, 'YYYY-MM-DD').value + ' 23:59:59'
    dialogRef.value.params = {
      startTime,
      endTime,
      // 1=案件状态、2=案件类型、3=案件分析
      queryType: 3,
      // 1=状态查询、2=破产程序查询
      type: 2,
    }
    if (isApp.value) {
      if (window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler('testFromJS', JSON.stringify(dialogRef.value.params))
      } else {
        window.flutter_inappwebview._callHandler('testFromJS', setTimeout(function() { }), JSON.stringify(dialogRef.value.params))
      }
      window.webkit.messageHandlers.testFromJS.postMessage(JSON.stringify(dialogRef.value.params))
    } else {
      dialogRef.value.flag = 'ZAJJE'
      dialogRef.value.visible = true
    }
  })
}
</script>
