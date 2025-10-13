<!--项目列表-->
<template>
  <div class="case_in_progress">
    <div class="project_search">
      <el-input v-model="searchData.meetName" placeholder="搜索会议名称" class="cus_search" clearable size="mini" suffix-icon="el-icon-search" @input="fetchList(1)" />
      <!-- 管理员成员不可新增 -->
      <el-button v-if="role.member !== MANAGE_MEMBER && isEdit" icon="el-icon-plus" size="mini" type="primary" @click="onCreate()">新增会议</el-button>
    </div>
    <div class="project_body">
      <div
        v-loading="projectListLoad"
        element-loading-spinner="loading-animation"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        style="height:100%;overflow: hidden;">
        <ul v-if="projectList.length" class="project_body_list">
          <li v-for="v in projectList" :key="v.id" class="project_body_list_item" @click="onEdit(v)">
            <span class="company_name no_wrap"> {{ v.meetName || '-' }}</span>
            <span class="no_wrap"><i style="color: #999;">会议时间：</i>{{ v.meetTime || '-' }}</span>
            <span><i style="color: #999;">会议状态：</i>
              <!-- 0 未开始；2 进行中；9 已结束；-3 彻底删除 -->
              <span v-if="v.status === 0" class="status--wait">{{ v.statusName || '-' }}</span>
              <span v-else-if="v.status === 9" class="status--done">{{ v.statusName || '-' }}</span>
              <span v-else-if="v.status === 2" class="status--progress">{{ v.statusName || '-' }}</span>
              <span v-else>{{ v.statusName || '-' }}</span>
            </span>
            <span class="user">
              <i style="color: #999;">创建者：</i>
              <el-avatar :src="getAvatar(v.userPhotoPath)" size="medium" />
              {{ v.createUserName || '-' }}
            </span>
          </li>
        </ul>
        <div v-if="!projectListLoad && projectList.length === 0" class="cus_empty w-full h-full-15"></div>
      </div>
      <div class="page_body_pagination">
        <el-pagination
          v-show="total > 0"
          :current-page="searchData.pageNum"
          :page-size="10"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          @current-change="fetchList($event)" />
      </div>
    </div>
    <el-dialog v-model="modal.visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" title="新增会议" width="500px" top="20vh">
      <el-form ref="subFormRef" :model="modal.form" :rules="modal.rules" inline size="mini">
        <el-form-item label="会议名称" prop="meetName">
          <el-input v-model="modal.form.meetName" style="width: 350px;" />
        </el-form-item>
        <el-form-item label="会议时间" prop="meetTime">
          <el-date-picker v-model="modal.form.meetTime" :picker-options="{ disabledDate: firstMeetingDateDisabled }" style="width: 350px;" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: space-around; padding-top: 50px;">
        <el-button size="mini" @click="onCancel()">取消</el-button>
        <el-button :loading="modal.loading" size="mini" type="primary" @click="onSave()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CASE_EDIT_TABLE_KEY, MANAGE_MEMBER } from '@/constant'
export default {
  setup(props) {
    const router = useRouter()
    return { router }
  },
  props: {
    // 当前案件主要信息
    case: {
      type: Object,
      required: true,
    },
    role: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      MANAGE_MEMBER,
      searchData: {
        pageSize: 10,
        pageNum: 1,
        meetName: '',
      },
      total: 0,
      projectList: [],
      projectListLoad: false,
      modal: {
        visible: false,
        form: {
          meetName: '',
          meetTime: '',
        },
        rules: {
          meetName: [{ required: true, message: '会议名称不能为空！' }],
          meetTime: [{ required: true, message: '会议时间不能为空！' }],
        },
        loading: false,
      },
    }
  },
  computed: {
    isEdit() {
      return this.case.edit === 'true'
    },
  },
  created() {
    this.init()
    this.fetchList(this.searchData.pageNum)
  },
  methods: {
    onCreate() {
      this.modal.visible = true
      this.modal.form.meetName = this.case.caseName + `第${this.toChinesNum(this.total + 1)}次债权人会议`
    },
    // 判断缓存中是否存在当前页面状态
    init() {
      const meetQueryStr = window.localStorage.getItem(CASE_EDIT_TABLE_KEY)
      if (meetQueryStr) {
        const params = JSON.parse(meetQueryStr)
        this.searchData.pageNum = params.pageNum || this.searchData.pageNum
        this.searchData.meetName = params.meetName || this.searchData.meetName
      }
    },
    toChinesNum(num) {
      const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] // changeNum[0] = "零"
      const unit = ['', '十', '百', '千', '万']
      num = parseInt(num)
      const getWan = (temp) => {
        const strArr = temp.toString().split('').reverse()
        let newNum = ''
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
        }
        return newNum
      }
      const overWan = Math.floor(num / 10000)
      let noWan = num % 10000
      if (noWan.toString().length < 4) noWan = '0' + noWan
      return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    },
    // 拼接用户头像
    getAvatar(url) {
      if (url) {
        return url.search('https') === -1 ? (import.meta.env.VITE_OBS_URL + url) : url
      } else {
        return ''
      }
    },
    onCancel() {
      this.modal.visible = false
      this.modal.form.meetName = this.case.caseName + '第一次债权人会议'
      this.modal.form.meetTime = ''
    },
    // 新增会议
    async onSave() {
      const validate = await this.$refs.subFormRef.validate()
      if (!validate) return false
      try {
        this.modal.loading = true
        const res = await meetModifyApi({ ...this.modal.form, projectId: this.case.projectId })
        if (res.success) {
          ElMessage.success('操作成功！')
          this.onCancel()
          this.fetchList()
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message })
      } finally {
        this.modal.loading = false
      }
    },
    // 今天之前日期不可选择
    firstMeetingDateDisabled(date) {
      const cur = Date.now() - 24 * 3600 * 1000
      const start = new Date(date).getTime()
      return start < cur
    },
    // 表格数据
    async fetchList(pageNum = 1) {
      try {
        this.searchData.projectId = this.case.projectId
        this.projectListLoad = true
        this.searchData.pageNum = pageNum
        const res = await meetFindPageApi(this.searchData)
        if (res.success) {
          this.projectList = res.data.records
          this.total = res.data.total
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        this.projectListLoad = false
      }
    },
    onEdit(row) {
      // 存储查询参数，用于返回当前页面时回到当前状态
      localStorage.setItem(CASE_EDIT_TABLE_KEY, JSON.stringify(this.searchData))
      this.router.push({ path: '/meeting', query: { row: JSON.stringify(row), case: JSON.stringify(this.case) }})
    },
  },
}
</script>

<style scoped >
.case_in_progress {
  border: 1px solid #e6e6e6;
  height: 100%;
}
.project_search {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.project_body {
  height: calc(100% - 40px);
  width: 100%;
  overflow: auto;
  position: relative;
}
.project_body_list {
  height: calc(100% - 60px);
  padding: 0 25px;
  box-sizing: border-box;
  overflow-y: auto;
}
.project_body_list_item {
  height: 120px;
  width: 100%;
  line-height: 120px;
  border-radius: 4px;
  box-shadow: 0 -2px 12px 0 #e6e6e6;
  margin: 12px 0;
  padding: 0 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 350px;
  column-gap: 20px;
  font-size: 14px;
  color: #333;
}
.company_name {
  cursor: pointer;
  font-size: 16px;
}
.company_name:hover {
  color: #a69480;
}
.no_wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status--wait {
  color: darkgoldenrod;
}
.status--progress {
  color: rgb(74, 153, 74);
  font-weight: bolder;
  font-size: 13px;
}
.status--done {
  color: #a69480;
}
.user {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.page_body_pagination {
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 0;
  display:flex;
  flex-flow: row-reverse;
  padding-right: 20px;
}
</style>
