<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" :title="fileName" custom-class="file-info" top="10vh" width="500px" >
    <el-table :data="table" size="mini" max-height="600px" stripe border style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="creditorNum" label="债权人编号"></el-table-column>
      <el-table-column prop="creditorName" label="债权人名称" ></el-table-column>
      <el-table-column prop="readed" label="阅读文件">
        <template>
          已阅读
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="阅读时间" width="150" ></el-table-column>
    </el-table>
    <div class="file-info__footer" >
      <el-checkbox :value="downloadable" :disabled="disabled" @change="onChange($event)" >允许参会人员下载文件</el-checkbox>
      <el-button type="primary" size="mini" icon="el-cion-download" @click="onExport()">导出明细</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      downloadable: false,
      fileId: '',
      disabled: false,
      fileName: '',
      params: {
        pageNum: 1,
        pageSize: 1000,
      },
      table: [],
    }
  },
  watch: {
    visible(bool) {
      if (bool) {
        this.fetchList()
      }
    },
  },
  methods: {
    async onExport() {
      try {
        const res = await meetFileExportApi(this.fileId)
        if (res.status === 200) {
          const fileNameList = this.fileName.split('.')
          const blob = new Blob([res.data])
          const a = document.createElement('a')
          const url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = fileNameList[0] + '.xlsx'
          a.click()
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      }
    },
    async onChange(e) {
      try {
        this.disabled = true
        const res = await meetFileDownAbleApi({ fileId: this.fileId, downloadable: Number(e) })
        if (res.success) {
          ElMessage.success('操作成功！')
          this.downloadable = e
          this.$emit('refresh')
        } else {
          ElMessage.warning(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.warning(error.message)
      } finally {
        this.disabled = false
      }
    },
    async fetchList() {
      try {
        const res = await meetFileInfoApi({ ...this.params, fileId: this.fileId })
        if (res.success) {
          this.table = res.data.records
        } else {
          ElMessage.warning(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.warning(error.message)
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-dialog__title) {
  padding-right: 1em;
  box-sizing: border-box;
  display: inline-block;
}
.file-info .file-info__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}
</style>
