<template>
  <ul class="box">
    <li v-for="v in list" :key="v.id" class="item">
      <div class="question">
        <p class="header">
          <span class="header_title">{{ v.createUser }}</span>
          <span class="header_date">{{ v.createTime }}</span>
        </p>
        <div>
          <span style="color: #999999;">
            异议内容：
          </span>
          {{ v.remarks }}
        </div>
        <div v-if="v.files">
          <p style="color: #999999;">
            附件列表：
          </p>
          <p v-for="f in v.files" :key="f.id" style="cursor: pointer; color: #a69480; padding-left: 5em;" @click="download(f)">
            {{ f.fileName }}
            <el-icon><IconEpDownload /></el-icon>
          </p>
        </div>
      </div>
      <div v-if="v.reply && Object.keys(v.reply).length > 0" class="answer">
        <p class="header">
          <span class="header_title">{{ v.reply.updateUser }}</span>
          <span class="header_date">{{ v.reply.createTime }}</span>
        </p>
        <p>
          <span style="color: #999999;">
            异议状态：
          </span>
          <span>
            {{ ['未审核', '异议成立', '异议不成立'][v.reply.examineStatus] }}
          </span>
        </p>
        <div>
          <span style="color: #999999;">
            异议审查意见：
          </span>
          {{ v.reply.remarks }}
        </div>
        <div v-if="v.reply.files">
          <p style="color: #999999;">
            附件列表：
          </p>
          <p v-for="f in v.reply.files" :key="f.id" style="cursor: pointer; color: #a69480; padding-left: 5em;" @click="download(f)">
            {{ f.fileName }}
            <el-icon><IconEpDownload /></el-icon>
          </p>
        </div>
      </div>
      <div v-else-if="creditor.canReviewer" class="btn">
        <el-button type="primary" icon="el-icon-s-promotion" size="mini" @click="visible = true; form.parentId = v.id">异议回复</el-button>
      </div>
    </li>
    <li v-if="list.length === 0" class="cus_empty h-full w-full"></li>
    <li v-else class="no_more">没有更多了</li>
    <el-dialog v-model="visible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" title="异议回复" width="500px">
      <div class="dia_content">
        <p style="line-height: 3em;">异议状态：</p>
        <p>
          <span :class="{ tag: true, active: form.examineStatus === 1 }" @click="form.examineStatus = 1">
            <el-icon><IconEpCircleCheck /></el-icon>
            异议成立
          </span>
          <span :class="{ tag: true, active: form.examineStatus === 2 }" @click="form.examineStatus = 2">
            <el-icon><IconEpCircleClose /></el-icon>
            异议不成立
          </span>
        </p>
        <p style="line-height: 3em;">异议审查意见：</p>
        <el-input :autosize="{ minRows: 4 }" v-model="form.remarks" type="textarea" placeholder="请输入申报地点 . . ." maxlength="200" show-word-limit />
        <HuaweiObsUpload v-if="visible" system-type="dept" @returnFileList="$event => form.fileList = $event">
          <span style="color: #a69480;">
            <el-icon><IconEpUpload /></el-icon>
            上传附件
          </span>
        </HuaweiObsUpload>
      </div>
      <div class="dia_footer">
        <el-button size="mini" @click="onCancel()">取消</el-button>
        <el-button type="primary" size="mini" @click="onReply">确定</el-button>
      </div>
    </el-dialog>
  </ul>
</template>

<script>
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
export default {
  props: {
    caseInfo: {
      type: Object,
      required: true,
    },
    creditor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      list: [],
      form: {
        remarks: '',
        examineStatus: 1,
        parentId: null,
        fileList: [],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const { creditorId, moneyDetailId } = this.creditor
        const res = await objectionListApi({ creditorId, moneyDetailId })
        if (res.success) {
          this.list = res.data
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    onCancel() {
      this.visible = false
      this.form.remarks = ''
      this.form.examineStatus = 1
      this.form.parentId = null
      this.form.fileList.length = 0
    },
    async onReply() {
      try {
        if (!this.form.remarks) {
          ElMessage.warning('请输入回复内容！')
          return false
        }
        this.form.projectId = this.caseInfo.projectId
        this.form.moneyDetailId = this.creditor.moneyDetailId
        this.form.creditorId = this.creditor.creditorId
        this.form.fileList = this.form.fileList.map(v => ({ fileName: v.fileName, filePath: v.filePath }))
        const res = await objectionReplyApi(this.form)
        if (res.success) {
          ElMessage.success('操作成功！')
          this.onCancel()
          this.fetchData()
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    download({ filePath, fileName }) {
      obsFileDownload(filePath, fileName)
    },
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0px;
}
.item {
  border: 1px solid #ededed88;
  box-shadow: 0 0 5px #ededed;
  padding: 12px 20px;
  box-sizing: border-box;
  line-height: 2em;
  font-size: 14px;
  margin-bottom: 20px;
  background: #fff;
}
.question {
  padding: 12px 0;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header_date {
  color: #999;
}
.answer {
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header_date {
  color: #999;
}
.btn {
  text-align: right;
}
.no_more {
  padding-top: 50%;
  text-align: center;
  color: #ccc;
  font-size: 14px;
}
.dia_content {
  line-height: 2.5em;
}
.tag {
  border: 1px solid #ebeef5;
  padding: 12px 20px;
  font-size: 14px;
  line-height: 3em;
  border-radius: 5px;
  cursor: pointer;
}
.dia_content .tag:hover, .dia_content .tag.active {
  border-color: #a69480;
  color: #a69480;
}
.dia_footer {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
