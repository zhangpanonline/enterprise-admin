<template>
  <div class="memo">
    <!--文档列表-->
    <div class="overview-title ">
      <!-- <el-input
        v-model="searchData.fileName"
        placeholder="请输入登记人"
        style="width: 300px;"
        clearable

        @change="getFileAll"
      ></el-input> -->

      <el-date-picker
        v-model="searchData.date"
        value-format="YYYY-MM-DD"
        type="date"

        @change="getFileAll"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-cascader
        v-model="casePhaseIds"
        :options="stageList"

        :props="optionProps"
        @change="handleChange1"
        clearable
        placeholder="选择案件阶段"
        ref="cascadera"
      ></el-cascader>

      <el-select
        v-model="searchData.caseStatus"
        placeholder="案件状态"

        clearable
        @change="getFileAll"
      >
        <el-option
          v-for="item in caseStat"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        class="upload"

        @click="handleUpload(false)"
        >新增</el-button
      >
    </div>
    <div class="bg-white h-full-15 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @fetchData="getFileAll" @sizeChange="tableData.pageSize = $event; getFileAll()"  >
      <template #caseStatus="scope">
          {{ scope.row.caseStatus == 2 ? "审理中" : "已结案" }}
      </template>
      <template #caozuo="scope" >
          <div class="flex gap-2">
            <span
            class="text-primary cursor-pointer"
            @click="godetails(scope.row)"
              >详情</span
            >
            <span
            class="text-primary cursor-pointer"
            @click="handleUpload(scope.row, true)"
              >编辑</span
            >
            <span
            class="text-warning cursor-pointer"
            @click="handleDel(scope.row, scope.$index)"
              >删除</span
            >
            </div>
      </template>
    </Table>
  </div>

    <!--  -->
    <el-dialog
      v-model="fileVisible"
      :close-on-click-modal="!fileVisible"
      :close-on-press-escape="!fileVisible"
      :before-close="handleClose"
      :title="ruleForm.id ? '记录编辑' : '记录新增'"
      width="60%"
      class="fileVisible"
      top="15vh"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记人：" prop="userName">
              <el-input v-model="userName" disabled /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="登记时间：" prop="userName">
              <el-input v-model="curDate" disabled /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              label="案件阶段"
              prop="casePhase"
              :rules="rules.notNull"
            >
              <el-cascader
                v-model="casePhaseIds"
                :options="stageList"
                :props="optionProps"
                @change="handleChange"
                ref="cascader"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              label="案件状态："
              prop="caseStatus"
              :rules="rules.notNull"
            >
              <el-radio-group v-model="ruleForm.caseStatus">
                <el-radio
                  :label="item.id"
                  v-for="(item, index) in caseStat"
                  :key="index"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group></el-form-item
            ></el-col
          >
          <el-col :span="24">
            <el-row>
              <el-col :span="6">
                <el-form-item label="是否提醒：" prop="showWarn">
                  <el-switch
                    v-model="ruleForm.showWarn"
                    active-color="#13ce66"
                    inactive-color="#ccc"
                  >
                  </el-switch
                ></el-form-item>
              </el-col>

              <el-col :span="8" v-if="ruleForm.showWarn">
                <el-form-item
                  label="提醒时间："
                  prop="sendDate"
                  :rules="rules.notNull"
                >
                  <el-date-picker
                    v-model="ruleForm.sendDate"
                    :disabled-date="disabledDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="x"
                  >
                  </el-date-picker
                ></el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" v-if="ruleForm.showWarn">
            <el-form-item
                  label="提醒内容："
                  prop="sendContent"
                  :rules="rules.notNull">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="ruleForm.sendContent"
                maxlength="30"
                placeholder="输入的提醒内容"
              ></el-input>
              </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="跟进详细记录："
              prop="recordDetails"
              :rules="rules.notNull"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 6 }"
                v-model="ruleForm.recordDetails"
                maxlength="5000"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件：" prop="userName">
              <huawei-obs-upload
                :limit="8"
                :extension="['doc', 'docx', 'png']"
                sub-type="file"
                :inFileList="fileList"
                @returnFileList="returnFileList"
              ></huawei-obs-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div></div>

      <div  class="dialog-footer text-right">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveFileDate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <memoDetails
      :details="details"
      v-if="detailsType"
      @setclose="setclose"
    ></memoDetails>
  </div>
</template>

<script>
import memoDetails from './memoDetails.vue'
import { dateFormat } from '@/plugins/date.js'
import fileDownload from '@/components/HuaweiObsUpload/obsDownload.js'

export default {
  props: {
    // 当前案件主要信息
    case: {
      type: Object,
      required: true,
    },
  },
  components: {
    memoDetails,
  },
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  data() {
    return {
      searchData: {
        pageNum: 1,
        pageSize: 10,
      },
      tableData: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        loading: true,
      },
      tableHeader: [
        { type: 'index', label: '序号', width: '55' },
        { prop: 'userName', label: '登记人' },
        { prop: 'createTime', label: '登记时间' },
        { prop: 'dictLabel', label: '案件阶段' },
        { prop: 'caseStatus', label: '案件状态' },
        { prop: 'caozuo', label: '操作', fixed: 'right' },
      ],
      detailsType: false,
      rules: {
        notNull: { required: true, message: '不能为空', trigger: 'blur' },
      },
      optionProps: {
        value: 'id',
        label: 'dictLabel',
        children: 'children',
        checkStrictly: true,
      },
      fileVisible: false,
      total: 0,
      companyId: '',
      ruleForm: {},
      projectId: '',
      fileList: [],
      caseStat: [
        {
          name: '审理中',
          id: '2',
        },
        {
          name: '已结案',
          id: '9',
        },
      ],
      stageList: [],
      casePhaseIds: [],
      details: {},

    }
  },
  computed: {
    curDate() {
      return dateFormat(new Date())
    },
    userName() {
      return this.appStore.userInfo.fullName
    },
  },
  async mounted() {
    this.getFileAll()
    const response = await getDictApi({
      code: 'bankruptCaseTypeTwo',
    })
    if (response.success) {
      this.stageList = response.data
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    },
    handleChange(val) {
      if (this.$refs['cascader'].getCheckedNodes()[0]) {
        this.ruleForm.casePhase = this.$refs[
          'cascader'
        ].getCheckedNodes()[0].value
      }
    },
    handleChange1() {
      if (this.$refs['cascadera'].getCheckedNodes()[0]) {
        this.searchData.casePhase = this.$refs[
          'cascadera'
        ].getCheckedNodes()[0].value
      } else {
        this.searchData.casePhase = null
      }
      this.getFileAll()
    },
    setclose() {
      this.detailsType = false
    },
    async godetails(row, type) {
      const response = await getMemoDetails(row.id)
      if (response.success) {
        if (type) {
          this.ruleForm = response.data

          this.casePhaseIds = this.setcaseIds(
            this.stageList,
            this.ruleForm.casePhase
          )
          if (this.ruleForm.files) {
            this.fileList = this.ruleForm.files
            this.fileList.map((item, index) => {
              item.uid = item.id
            })
          }
          this.fileVisible = true
        } else {
          this.details = response.data
          this.detailsType = true
        }
      }
    },
    setcaseIds(val, id) {
      var ids = []
      val.map((item, index) => {
        if (item.id === id) {
          ids.push(id)
          return
        } else {
          item.children.map((itema, indexa) => {
            if (itema.id === id) {
              ids.push(item.id)
              ids.push(id)
              return
            }
          })
        }
      })
      return ids
    },
    handleClose() {
      this.ruleForm = {}
      this.fileList = []
      this.casePhaseIds = []
      this.fileVisible = false
    },

    handleUpload(row, type) {
      if (type) {
        this.godetails(row, type)
      } else {
        this.fileVisible = true
      }
    },
    async getFileAll(pageNum = 1) {
      try {
        this.searchData.projectId = this.$route.query.projectId
        this.searchData.pageNum = pageNum
        this.tableData.loading = true
        this.tableData.pageNum = pageNum
        this.searchData.pageSize = this.tableData.pageSize
        const response = await getMemoList(this.searchData)
        if (response.success) {
          this.tableData.list = response.data.records
          this.tableData.total = response.data.total
        }
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      } finally {
        this.tableData.loading = false
      }
    },
    async saveFileDate() {
      this.ruleForm.projectId = this.$route.query.projectId
      this.ruleForm.createUser = this.appStore.userInfo.userId
      this.ruleForm.createTime = this.curDate
      this.ruleForm.files = this.fileList.map((item, index) => {
        return {
          projectId: this.$route.query.projectId,
          fileName: item.fileName,
          filePath: item.filePath,
          fileType: 5,
        }
      })
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const res = await saveOrUpdateMemo(this.ruleForm)
          if (res.data) {
            ElMessage.success('提交成功')
            this.handleClose()
            this.getFileAll()
          }
        } else {
          return false
        }
      })
    },
    handleDownload(val) {
      fileDownload(val.filePath, val.fileName)
    },

    returnFileList(val) {
      this.fileList = val
      console.log(val)
    },
    handleSelectionChange(val, row) {
      console.log(val)
      this.selectArr = val
    },
    selectAll(val) {
      console.log(val)
      this.selectArr = val
    },
    async handleDel(val) {
      ElMessageBox.confirm(`确定删除该案件吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const response = await setDeleteMemo(val.id)
          if (response.success) {
            this.getFileAll()
          }
        })
        .catch(e => e)
    },
  },
}
</script>
<style scoped>
.memo {
  height: 100%;
  overflow: hidden;
  padding: 0 20px 20px;
  box-sizing: border-box;
}
.overview-title {
  height: 60px;
  line-height: 60px;
  color: #a69480;
  box-sizing: border-box;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 20px;

}

.upload {
 margin-left: auto;
}
.el-pagination{
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
