<template>
<div  v-loading="loading">

  <el-dialog
     v-model="visible"
    title="工作日报"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="onCancel"
    width="70%"
    top="10vh">
    <ul class="header" >
      <li>
        <span class="label" >填写人：</span>
        <span class="value" >{{ form.userName || this.appStore.userInfo.userName || '-' }}</span>
      </li>
      <li>
        <span class="label" >填写日期：</span>
        <span class="value" >{{ form.createTime || curDate }}</span>
      </li>
      <li class="flex items-center" >
        <span class="label" >日报日期：</span>
        <span class="value">
          <el-date-picker
            v-model="form.recordTime"
            type="date"
            class="cus_search"
            placeholder="选择日期时间">
          </el-date-picker>
        </span>
      </li>
      <li style="float: right;">
        <el-button type="primary"  @click="onCreate()" >
          <template #icon><icon-ep-plus /></template>添加</el-button>
      </li>
    </ul>
    <el-table :data="form.detailParamList"  style="width: 100%;" :header-cell-style="headerCellStyle" :row-style="rowStyle">
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column prop="projectName" label="案件名称" width="230">
        <template #default="scope">
          <el-select v-model="scope.row.projectName">
            <el-option v-for="(_, caseName) in caseList" :key="caseName" :label="caseName" :value="caseName"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="context" label="工作内容">
        <template #default="scope">
          <el-input type="textarea" :rows="4" show-word-limit :maxlength="5000" v-model="scope.row.context" />
        </template>
      </el-table-column>
      <el-table-column prop="duration" width="220" label="时长">
        <template #default="scope">
          <el-input-number :min="0" v-model="scope.row.duration" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" >
        <template #default="{  $index }">
          <span
            class="text-warning cursor-pointer"
            @click="onDel($index)"
              >删除</span
            >
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog-footer text-right" style="margin-top: 15px">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onSave()">确 定</el-button>
    </div>
  </el-dialog>
</div>

</template>

<script>
import { dateFormat } from '@/plugins/date.js'
export default {
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  data() {
    return {
      visible: false,
      caseList: {},
      loading: false,
      form: {
        recordTime: '',
        detailParamList: [{ projectName: '', context: '', duration: '' }],
      },
    }
  },
  watch: {
    visible(bool) {
      if (bool) {
        this.getCaseList()
        if (!this.form.id) {
          this.form.recordTime = this.curDate.slice(0, 10)
        }
      }
    },
  },
  computed: {
    curDate() {
      return dateFormat(new Date())
    },
  },
  methods: {
    // 表头样式
    headerCellStyle() {
      return { background: 'var(--primary-color-50)', color: '#333', height: '60px' }
    },
    // 行样式
    rowStyle({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return { background: 'var(--primary-color-50)', color: '#333', height: '56px' }
      } else {
        return { color: '#333', height: '56px' }
      }
    },
    // 获取当前登录用户的案件列表
    async getCaseList() {
      try {
        const res = await getChangeCaseListApi()
        if (res.success) {
          this.caseList = res.data.reduce((acc, cur) => {
            acc[cur.caseName] = cur.projectId
            return acc
          }, {})
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      }
    },
    onDel(i) {
      if (this.form.detailParamList.length > 1) {
        this.form.detailParamList.splice(i, 1)
      }
    },
    onCreate() {
      this.form.detailParamList.push({ projectName: '', context: '', duration: '' })
    },
    async onSave() {
      if (!this.form.recordTime) {
        ElMessage.warning({ message: '请选择日报日期！', showClose: false })
        return false
      }
      if (this.form.detailParamList.some(obj => (!obj.projectName || !obj.context))) {
        ElMessage.warning({ message: '请完善日报信息！', showClose: false })
        return false
      }
      try {
        this.form.detailParamList = this.form.detailParamList.map(v => {
          if (!v.projectId) {
            v.projectId = this.caseList[v.projectName]
          }
          return v
        })
        const recordTime = dateFormat(this.form.recordTime).slice(0, 10)
        const res = await updateDailyApi({ ...this.form, recordTime })
        if (res.success) {
          ElMessage.success({ message: '操作成功！', showClose: false })
          this.$emit('ok')
          this.onCancel()
        } else {
          ElMessage.error({ message: res.msg, showClose: false })
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      } finally {
        this.loading = false
      }
    },
    onCancel(done) {
      this.visible = false
      this.form = {
        recordTime: '',
        detailParamList: [{ projectName: '', context: '', duration: '' }],
      }
      if (done) done()
    },
  },
}
</script>

<style scoped>
.label {
  color: #999;
}
.el-dialog__body {
  height: 500px;
  overflow: hidden auto;
}
.header {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}
</style>
