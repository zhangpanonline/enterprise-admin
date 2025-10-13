<template>
  <div class="box" >
    <HuaweiObsUpload
      v-if="!isUpload && creditor.canReviewer"
      ref="uploadRef"
      :show-file-list="false"
      :limit="1"
      class="upload"
      temp-file="tempFile"
      system-type="dept"
      @returnFile="upload">
      <div>上传债权审查结果书</div>
    </HuaweiObsUpload>
    <template v-if="isUpload && creditor.canReviewer">
      <div v-if="!result" class="success" >
        <img :src="icon[FILE_SUFFIX[params.fileList[0]['fileName'].split('.')[1]]]" style="width: 20px;">
        <span class="success_file" >{{ params.fileList[0]['fileName'] }}</span>
        <span class="success_delete" @click="isUpload = false" >删除</span>
      </div>
      <div v-if="result && !isConfirm" class="success" >
        <img :src="icon[result.icon]" :alt="result.icon" style="width: 20px;">
        <span class="success_file" >{{ result.fileName }}</span>
        <span class="success_delete" @click="onDelete()" >删除</span>
      </div>
    </template>
    <div v-if="result && isConfirm" class="confirm" >
      <span class="confirm_avatar" >
        <img :src="result.path || userPhoto" />
      </span>
      <span class="confirm_name" >
        <i>{{ result.updateUser }}</i>
        <span>
          <i style="color: #999; font-size: 12px;" >{{ result.updateTime || '-' }}</i>
          <span style="color: #a69480; padding-left: 1em; font-size: 12px; cursor: pointer;" @click="onDownload">点击下载结果书</span>
        </span>
      </span>
      <span class="confirm_state" >
        已确认
      </span>
    </div>
    <el-button v-if="isUpload && !result && creditor.canReviewer" class="btn" type="primary" size="large" @click="onConfirm()" >确认发送</el-button>
  </div>
</template>
<script>
import { FILE_SUFFIX, ICON } from '@/constant'
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
      isConfirm: false, // 审查结果书是否已确认
      result: null,
      isUpload: false,
      icon: ICON,
      FILE_SUFFIX,
      params: {},
      userPhoto: new URL('/src/assets/images/portrait.png', import.meta.url).href,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.params = {}
        this.result = null
        this.isUpload = false
        this.isConfirm = false
        const res = await findAuditResultsBookApi(this.creditor.creditorId)
        if (res.success) {
          if (res.data && res.data.id) {
            this.result = res.data
          } else {
            this.result = null
          }
          if (this.result) {
            this.isUpload = true
            const suffix = this.result.fileName.split('.')[1]
            if (suffix) {
              this.result.icon = FILE_SUFFIX[suffix]
            }
            this.isConfirm = this.result.status === 9
            if (this.result.userPhotoPath && this.result.userPhotoPath.search('https') === -1) {
              this.result.path = import.meta.env.VITE_OBS_URL + this.result.userPhotoPath
            }
          }
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onDelete() {
      try {
        const confirm = await ElMessageBox.confirm('确认删除？', '提示')
        if (!confirm) {
          return false
        }
        const res = await delAuditResultApi(this.result.id)
        if (res.success) {
          ElMessage.success('操作成功！')
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
    async onConfirm() {
      try {
        const confirm = await ElMessageBox.confirm('确认发送？', '提示')
        if (!confirm) {
          return false
        }
        const res = await resultBoolUploadApi(this.params)
        if (res.success) {
          ElMessage.success('操作成功！')
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
    async upload(fileList) {
      // 不能传id，否则会出BUG
      // eslint-disable-next-line no-unused-vars
      const { id, ...files } = fileList
      this.params = {
        projectId: this.caseInfo.projectId,
        moneyDetailId: this.creditor.moneyDetailId,
        userId: useAppStore().userInfo.userId,
        companyId: this.caseInfo.companyId,
        creditorId: this.creditor.creditorId,
        fileList: [files],
        folderName: '审查结果书',
      }
      this.isUpload = true
    },
    onDownload() {
      obsFileDownload(this.result.filePath, this.result.fileName)
    },
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  overflow-y: auto;
  font-size: 14px;
}
.upload {
  height: 3.5em;
  line-height: 3.5em;
  text-align: center;
  border: 1px dashed #a69480;
  border-radius: 6px;
  color: #a69480;
  cursor: pointer;
}
.upload:hover {
  background: #ededed44;
}
.success {
  padding: 12px;
  display: grid;
  grid-template-columns: 30px 1fr 40px;
  align-items: center;
  box-shadow: 0 2px 12px 0 #0000001a;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.success_file {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 90%;
}
.success:hover {
  background: #ededed44;
}
.el-icon-files {
  line-height: 35px;
  font-size: 20px;
}
.success_delete {
  color: red;
}
.confirm {
  height: 50px;
  display: grid;
  grid-template-columns: 50px 1fr 60px;
  align-items: center;
  font-size: 13px;
  box-shadow: 0 2px 12px 0 #0000001a;
  border: 1px solid #ededed88;
  border-radius: 6px;
}
.confirm_avatar {
  background: #ccc;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.confirm_avatar img {
  width: 40px;
  height: 40px;
}
.confirm_name {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.confirm_state {
  color: #a69480;
  line-height: 40px;
}
.btn {
  width: 100%;
  height: 40px;
}
</style>
