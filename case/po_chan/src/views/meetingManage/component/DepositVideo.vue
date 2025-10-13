<template>
  <div class="h-125" >
    <p class="text-danger text-xs" >视频证据只有三个月的有效期，请及时下载！</p>
    <Table :data="tableData" :columns="columns" >
      <template #caozuo="scope">
        <span v-if="scope.row.recordUrl" class="text-primary cursor-pointer flex items-center" @click="onDownload(scope.row)">
          <ElIcon><IconEpDownload /></ElIcon>下载
        </span>
      </template>
    </Table>
  </div>
</template>

<script setup>
/**
 * 视频录制文件列表， get
https://history.zhushucloud.com/history/recoding/list?meetingNumber=会议编码
返回
{"creator":"zyw","code":"000000","recordFile":[{"fileName":"历史录制-2023年2月16日18时21分59秒","creatTime":"2023-02-16 18:21:59","recordUrl":"https://history.zhushucloud.com/recordings/kpjlnifkzhljekzs/hy-1e-61954979_2023-02-16-10-21-59.mp4"}]}
recordUrl：播放/下载地址
 */
const props = defineProps({
  meetCode: {
    type: String,
    default: '',
  },
  meetName: {
    type: String,
    default: '',
  },
})
const columns = [
  { type: 'index', width: 80, label: '序号' },
  { prop: 'fileName', label: '视频名称' },
  { prop: 'creatTime', label: '视频存证时间' },
  { prop: 'caozuo', label: '操作', width: 100, fixed: 'right' },
]
const tableData = reactive({
  list: [],
  pageSize: 1,
  pageNum: 10,
  total: 0,
})
fetchList()
async function fetchList() {
  try {
    const response = await fetch(`https://history.zhushucloud.com/history/recoding/list?meetingNumber=${props.meetCode.toLowerCase()}`)
    const res = await response.json()
    tableData.list = res.recordFile
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
async function onDownload({ recordUrl, fileName }) {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: '正在请求资源，请稍等......',
    spinner: 'loading-animation',
  })
  try {
    var oReq = new XMLHttpRequest()
    oReq.open('GET', recordUrl, true)
    oReq.responseType = 'blob'
    oReq.onload = function() {
      var res = oReq.response
      const blob = new Blob([res])
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName + '.mp4'
      a.click()
      window.URL.revokeObjectURL(url)
      nextTick(() => {
        loadingInstance.close()
      })
      ElMessage.success('资源请求成功，开始下载...')
    }
    oReq.send()
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
</script>
