<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" title="短信通知" width="500px">
    <div class="wrap" >
      <p class="wrap_title" >通知内容：</p>
      <el-input :autosize="{ minRows: 10 }" v-model="content" type="textarea" placeholder="请输入通知内容 . . ." maxlength="500" show-word-limit/>
    </div>
    <div class="footer" >
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">发 送</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      content: '',
      params: {},
    }
  },
  methods: {
    close() {
      this.visible = false
      this.content = ''
      this.params = {}
    },
    async onSubmit() {
      try {
        if (!this.content) {
          ElMessage.warning('请输入要发送的通知内容！')
          return false
        }
        const confirm = await ElMessageBox.confirm('确认下发通知？', '提示', { type: 'warning' })
        if (confirm !== 'confirm') return false
        this.params.content = this.content
        const res = await creaditorSendNoticeApi(this.params)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.$emit('success')
          this.close()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
  },
}
</script>

<style  scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
.wrap .wrap_title {
  line-height: 2em;
  color: #666;
}
.wrap .wrap_upload {
  color: #a69480;
}
.footer {
  width: 100%;
  padding-top: 20px;
  display: flex;
  justify-content: space-around;
}
</style>
