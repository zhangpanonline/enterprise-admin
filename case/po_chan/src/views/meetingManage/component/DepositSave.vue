<template>
  <div class="h-125" >
    <Table :data="tableData" :columns="columns" @sizeChange="tableData.pageSize = $event; getList()" @fetchData="getList">
      <template #caozuo="scope">
        <span class="text-primary cursor-pointer flex items-center" @click="onDlownload(scope.row)">
          <ElIcon><IconEpDownload /></ElIcon>下载
        </span>
      </template>
    </Table>
  </div>
</template>
<script setup>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const props = defineProps({
  meetId: {
    type: String,
    required: true,
  },
})
const columns = [
  { type: 'index', width: '80', label: '序号' },
  { prop: 'name', label: '存证名称' },
  { prop: 'person', label: '存证人' },
  { prop: 'time', label: '公正时间' },
  { prop: 'caozuo', label: '操作', width: '100', fixed: 'right' },
]
const { tableData, fetchData } = useTable()
getList()
function getList(pageNum) {
  fetchData({
    api: meetDepositRecordApi,
    pageNum,
    params: { meetId: props.meetId },
    callback(res) {
      tableData.list = res.data
    },
  })
}
// 下载
function onDlownload({ filePath, name }) {
  obsFileDownload(filePath, name + '.pdf')
}
</script>
