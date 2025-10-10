<template>
  <div class="file" >
    <div class="file__header" >
      <span class="file__tips" >
        <ElIcon size="14" >
          <IconEpInfoFilled />
        </ElIcon>
        小提示：为了保证参会人良好的阅读会议资料，建议资料文档格式为PDF、Word、PNG、JPG等，可发起参会人签字的文档格式仅支持PDF、Word格式
      </span>
      <HuaweiObsUpload v-if="!isSave" :show-file-list="false" :extension="['doc', 'docx', 'pdf', 'png', 'jpg']" system-type="dept" temp-file="tempFile" @returnFile="onUploadOk">
        <el-button type="primary" size="mini" >
          <ElIcon>
            <IconEpPlus />
          </ElIcon>
          新增文件
        </el-button>
      </HuaweiObsUpload>
    </div>
    <ul v-loading="loading" class="file__content">
      <li v-for="v in list" :key="v.id" class="file__card" >
        <div class="file__file-name" >
          <img :src="(icon[v.icon] || icon.DEFAULT)" :title="v.fileName" :alt="v.fileName" />
          <span style="padding-left: .5em;" >{{ v.fileName }}</span>
        </div>
        <ul class="file__file-read" >
          <li>阅读 {{ v.read }}</li>
          <li>上传 {{ v.createTime }}</li>
        </ul>
        <div class="file__file-action">
          <ElIcon @click="onAction('info', v)">
            <IconEpPostcard />
          </ElIcon>
          <ElIcon @click="onAction('download', v)">
            <IconEpDownload />
          </ElIcon>
          <ElIcon v-if="!isSave" color="red" @click="onAction('del', v)">
            <IconEpDelete />
          </ElIcon>
        </div>
      </li>
      <li v-if="list.length === 0" class="cus_empty w-full h-full" ></li>
    </ul>
    <div class="file__footer">
      <el-pagination
        v-if="total"
        :current-page="params.pageNum"
        :page-size="20"
        :total="total"
        background
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        @current-change="fetchList($event)"/>
    </div>
    <FileInfo ref="fileInfoRef" @refresh="fetchList(params.pageNum)" />
  </div>
</template>

<script>
import { ICON, FILE_SUFFIX } from '@/constant'
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import FileInfo from './component/FileInfo.vue'
export default {
  components: {
    FileInfo,
  },
  props: {
    row: {
      type: Object,
      required: true,
    },
    // 当前会议是否已保存
    isSave: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      icon: ICON,
      params: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      loading: false,
      list: [],
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList(pageNum = 1) {
      try {
        this.loading = true
        const res = await meetFileListApi({ ...this.params, pageNum, recordId: this.row.id, projectId: this.row.projectId })
        if (res.success) {
          this.total = res.data.total
          this.list = res.data.records.map(v => {
            v.icon = FILE_SUFFIX[v.fileName.slice(v.fileName.lastIndexOf('.') + 1)] || 'DEFAULT'
            v.down = `${v.downloadCount}/${v.creditorCount}`
            v.read = `${v.readCount}/${v.creditorCount}`
            return v
          })
        } else {
          ElMessage.warning(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.warning(error.message)
      } finally {
        this.loading = false
      }
    },
    async onUploadOk({ fileName, filePath }) {
      try {
        const res = await meetFileCreateApi({ fileName, filePath, recordId: this.row.id })
        if (res.success) {
          ElMessage.success('新增成功！')
          this.fetchList()
        } else {
          ElMessage.warning(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.warning(error.message)
      }
    },
    onAction(key, row) {
      const _this = this
      if (key === 'info') {
        this.$refs.fileInfoRef.visible = true
        this.$refs.fileInfoRef.fileId = row.id
        this.$refs.fileInfoRef.downloadable = Boolean(row.downloadable)
        this.$refs.fileInfoRef.fileName = row.fileName
      } else if (key === 'download') {
        obsFileDownload(row.filePath, row.fileName)
      } else if (key === 'del') {
        ElMessageBox.confirm('确认删除此文件？', '文件删除', {
          type: 'warning',
          async callback(confirm) {
            if (confirm !== 'confirm') return false
            try {
              const res = await meetFileDelApi(row.id)
              if (res.success) {
                ElMessage.success('操作成功！')
                _this.fetchList()
              } else {
                ElMessage.warning(res.msg)
              }
            } catch (error) {
              console.error(error)
              ElMessage.warning(error.message)
            }
          },
        })
      }
    },
  },
}
</script>

<style scoped >
.file {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.file__header {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.file__tips {
  font-size: xx-small;
  color: #999;
  align-self: end;
}
.file__content {
  width: 100%;
  height: calc(100% - 100px);
  box-sizing: border-box;
  padding: 12px 20px;
  box-sizing: border-box;
  overflow: hidden auto;
}
.file__card {
  height: 75px;
  margin-bottom: 20px;
  padding: 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr 300px;
  align-items: center;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 0 -2px 12px 0 #e6e6e6;
  font-size: 14px;
  color: #666;
}
.file__card:hover {
  background-color: #f5f7fa;
}
.file__file-name {
  display: flex;
  align-items: center;
}
.file__file-read {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.file__file-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 220px;
  font-size: 24px;
}
.file__file-action > .el-icon {
  cursor: pointer;
  padding-left: 10px;
}
.file__footer {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-pagination {
  margin: 0;
}
</style>
