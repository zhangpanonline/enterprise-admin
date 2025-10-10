<template>
  <el-dialog v-model="visible" title="历史记录" custom-class="history" width="700px" top="10vh">
    <el-date-picker
      v-model="selectDate"
      :clearable="false"
      style="margin-bottom: 15px;"
      size="mini"
      type="daterange"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="getList()">
    </el-date-picker>
    <ol class="list" v-if="tree.length">
      <li v-for="item in tree" :key="item.key">
        <h3 style="padding-bottom: 1em;">{{ item.key }}</h3>
        <el-timeline>
          <el-timeline-item v-for="v in item.datas" :key="v.id" :timestamp="v.createTime.split(' ')[1]" color="#a69480" placement="top">
            <p v-if="v.type === 0">{{ `${v.chineseName} 创建了` }} <img :src="fileIcon(v.filePath)" class="icon" /> {{ v.fileName }} {{ fileName(v.filePath) }}</p>
            <p v-else-if="v.type === -3" style="text-decoration: line-through;">{{ `${v.chineseName} 删除了` }} <img :src="fileIcon(v.filePath)" class="icon" /> {{ `${v.fileName} ${fileName(v.filePath)}` }}</p>
            <p v-else-if="v.type === 2">{{ `${v.chineseName} 将 ${v.remark || '-'} ${fileName(v.filePath)} 重命名为` }} <img :src="fileIcon(v.filePath)" class="icon" /> {{ `${v.fileName} ${fileName(v.filePath)}` }}</p>
          </el-timeline-item>
        </el-timeline>
      </li>
    </ol>
    <div v-else class="empty">暂无操作记录</div>
  </el-dialog>
</template>

<script>
import { ICON, FILE_SUFFIX, FILE_SUFFIX_NAME } from '@/constant'
export default {
  data() {
    return {
      visible: false,
      projectId: '',
      selectDate: ['2022-12-4', '2023-1-23'],
      tree: [],
    }
  },
  created() {
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()
    this.selectDate = [
      `${m ? y : (y - 1)}-${m || 12}-${d}`,
      `${y}-${m + 1}-${d}`,
    ]
  },
  methods: {
    fileIcon(path) {
      if (path) {
        const suffix = path.split('.')[1]
        return suffix ? ICON[FILE_SUFFIX[suffix.toLowerCase()]] : ICON['DEFAULT']
      } else {
        return ICON['FOLDER']
      }
    },
    fileName(path) {
      if (path) {
        const suffix = path.split('.')[1]
        return suffix ? FILE_SUFFIX_NAME[suffix.toLowerCase()] : '文件'
      } else {
        return '文件夹'
      }
    },
    async getList() {
      try {
        const res = await getCaseFileHistroyApi({
          projectId: this.projectId,
          startDate: this.selectDate[0] + ' 00:00:00',
          endDate: this.selectDate[1] + ' 23:59:59',
        })
        if (res.success) {
          this.tree = res.data
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

<style scoped>
.list {
  max-height: 500px;
  overflow: hidden auto;
}
:deep(.el-dialog__body) .empty {
  height: 300px;
  text-align: center;
  line-height: 300px;
  color: #999;
  font-size: 14px;
}
:deep(.el-dialog__body) .icon {
  height: 20px;
  margin-bottom: -4px;
}
</style>
