<template>
  <div class="h-125" >
    <Table :data="tableData" :columns="columns" @sizeChange="tableData.pageSize = $event; getList()" @fetchData="getList">

      <template #play>
        <ElIcon size="28" ><IconEpVideoPlay class="text-primary cursor-pointer" /></ElIcon>
      </template>
      <template #caozuo="scope">
        <p class="flex" >
          <span v-if="scope.row.recordName" class="text-primary mr-3 cursor-pointer flex items-center" @click="onDlownload(scope.row.recordName)" >
            <ElIcon><IconEpDownload /></ElIcon>下载音频
          </span>
          <span v-if="scope.row.transcriptionName" class="text-primary cursor-pointer flex items-center" @click="onDlownload(scope.row.transcriptionName)" >
            <ElIcon><IconEpDownload /></ElIcon>下载文字
          </span>
        </p>
      </template>
    </Table>
  </div>
</template>
<script setup>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const props = defineProps({
  meetCode: {
    type: String,
    required: true,
  },
})
const columns = [
  { type: 'index', width: '80', label: '序号' },
  { prop: 'userName', label: '名称' },
  { prop: 'recorderPhone', label: '手机号' },
  { prop: 'meetingCode', label: '会议编码' },
  { prop: 'startTime', label: '开始时间' },
  { prop: 'endTime', label: '结束时间' },
  { prop: 'play', label: '播放音频' },
  { prop: 'caozuo', label: '操作', width: '180', fixed: 'right' },
]
const { tableData, fetchData } = useTable()
getList()
function getList(pageNum) {
  fetchData({
    api: meetDepositListenApi,
    pageNum,
    params: { meetingCode: props.meetCode, userName: '' },
  })
}
// 下载
function onDlownload(filePath) {
  obsFileDownload('/uploadfile' + filePath, filePath)
}
</script>
