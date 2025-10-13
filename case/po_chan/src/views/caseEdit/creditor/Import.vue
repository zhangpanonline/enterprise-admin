<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" title="债权人导入" width="700px" top="15vh" >
    <div class="wrap" >
      <img class="wrap_img" src="/src/assets/images/creditor_upload.png" alt="请选择债权人文件">
      <p class="wrap_title" >请选择债权人文件</p>
      <p class="wrap_tip" >支持xlsx格式文件，最大支持5000条记录</p>
      <p class="wrap_msg" >
        请下载<a class="wrap_msg_down" @click="download" >债权人信息导入模板<i class="el-icon-download" ></i></a>填写后导入
      </p>
      <el-upload
        v-if="visible"
        :http-request="handleUpload"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        action="string"
        accept=".xls, .xlsx"
        style="display: inline-block;margin: 0 20px;">
        <el-button type="primary">选择文件</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
import fileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
export default {
  data() {
    return {
      visible: false,
      projectId: '',
      userId: '',
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    download() {
      fileDownload('0/look/template/bankrupt-creditor-import-template.xlsx', '债权人信息导入模板.xlsx')
    },
    async handleUpload({ file }) {
      try {
        const formData = new FormData()
        formData.append('projectId', this.projectId)
        formData.append('userId', this.userId)
        formData.append('file', file)
        const res = await importCreditorPCApi(formData)
        if (res.success) {
          ElMessage.success('导入成功！')
          this.close()
          this.$emit('ok')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 上传之前
    beforeAvatarUpload(file) {
      // 上传文件判断
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      testmsg = testmsg.toLowerCase()
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        ElMessage({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning',
        })
      }
      if (!isLt2M) {
        ElMessage({
          message: '上传文件大小不能超过 10MB!',
          type: 'error',
        })
      }
      return (extension || extension2) && isLt2M
    },
  },
}
</script>

<style  scoped>
.wrap {
  text-align: center;
  line-height: 3em;
}
.wrap_img {
  margin: 0 auto;
}
.wrap_title {
  font-size: 16px;
  font-weight: bolder;
  color: #333;
}
.wrap_tip {
  font-size: 14px;
  color: #999;
}
.wrap_msg {
  font-size: 15px;
  color: #666;
  padding-bottom: 2em;
}
.wrap_msg_down {
  color: #a69480;
  cursor: pointer;
  padding: 0 .5em;
}
</style>
