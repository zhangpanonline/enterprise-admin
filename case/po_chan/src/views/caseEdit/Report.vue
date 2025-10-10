<!-- 资料管理 -->
<template>
  <div class="report">
    <!--文档列表-->
    <div class="overview-title">
      <el-input
        v-model="searchData.fileName"
        placeholder="请输入名称"
        style="width: 300px"
        clearable
        @change="getFileAll"
      ></el-input>
      <el-button
        v-if="status === '2' && isEdit"
        type="primary"
        class="upload"
        @click="handleUpload"
        >上传资料</el-button
      >
    </div>
    <div class="bg-white h-full-15 overflow-hidden">
    <Table :data="tableData" :columns="tableHeader" @fetchData="getFileAll" @sizeChange="tableData.pageSize = $event; getFileAll()"  >
      <template #caozuo="scope" >
          <div class="flex gap-2"   v-if="status === '2' && isEdit">
            <span
            class="text-primary cursor-pointer"
            @click="handleDownload(scope.row, scope.$index)"
              >下载</span
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

    <el-dialog
      v-model="fileVisible"
      :close-on-click-modal="!fileVisible"
      :close-on-press-escape="!fileVisible"
      title="上传资料"
      width="650px"
      class="fileVisible"
      top="15vh">
      <div>
        <div class="flex">
          <span><i style="color: red">*</i> 所属分类：</span>
          <el-select
            v-model="type"
            style="width: 350px; margin-bottom: 15px">
            <el-option
              v-for="(item, key) in projectTypeList"
              :value="item.id"
              :label="item.dictLabel"
              :key="key"></el-option>
          </el-select>
        </div>
        <HuaweiObsUpload
          v-if="fileVisible"
          :limit="1"
          :extension="['doc', 'docx']"
          sub-type="file"
          @returnFileList="returnFileList">
          <el-button type="primary">上传</el-button>
          <span class="text-xs pl-3" >请上传doc、docx格式文档！</span>
        </HuaweiObsUpload>
      </div>
      <div class="dialog-footer text-right">
        <el-button @click="fileVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFileDate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import http from '@/api/axiosInstance'

export default {
  setup() {
    const appStore = useAppStore()
    return { appStore }
  },
  name: '',
  props: {},
  data() {
    return {
      treeStep: {},
      fileName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      fileVisible: false,
      expandedKey: [],
      selectArr: [],
      fileList: [],
      searchData: {
        pageNum: 1,
        pageSize: 10,
      },
      projectId: '',
      projectTypeList: [
        {
          id: 'a213fdd01f1e4750a17dccd9059cb2a1',
          dictLabel: '劳动合同',
        },
        {
          id: '2e1330d71f9147e993f172c30b300afc',
          dictLabel: '公民授权委托书',
        },
        {
          id: '01cd09c596db4ed99571bd518e7a0252',
          dictLabel: '法定代表人/负责人身份证明书',
        },
        {
          id: 'f7d689bc5bff4b929c9e9fe50e415d83',
          dictLabel: '律师授权委托书',
        },
        {
          id: 'a75196eeb9ac40f79279790d363cd0e6',
          dictLabel: '债权人地址及联系方式确认书',
        },
      ],
      tableHeader: [
        { type: 'index', label: '序号', width: '55' },
        { prop: 'fileName', label: '文件名称' },
        { prop: 'chineseName', label: '创建人' },
        { prop: 'dictLabel', label: '模板类型' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'caozuo', label: '操作', fixed: 'right' },
      ],
      tableData: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        loading: true,
      },
      type: '',
      companyId: '',
      status: null,
      isEdit: false,
    }
  },

  computed: {},

  mounted() {
    this.projectId = this.$route.query.projectId
    this.companyId = this.$route.query.companyId
    this.status = this.$route.query.status
    this.isEdit = this.$route.query.edit === 'true'
    this.getFileAll()
  },

  methods: {

    searchFile() {

    },
    getTreeData() {

    },

    handleUpload() {
      this.fileList = []
      this.fileVisible = true
    },
    getFileAll(pageNum = 1) {
      try {
        this.searchData.pageNum = pageNum
        this.tableData.loading = true
        this.tableData.pageNum = pageNum
        this.searchData.pageSize = this.tableData.pageSize
        http.post('/bankruptFile/findFileListByTreeId', {
          fileName: this.searchData.fileName,
          projectId: this.projectId,
          pageNum: this.searchData.pageNum,
          pageSize: this.searchData.pageSize,
          fileType: 1,
        })
          .then(response => {
            if (response.success) {
              this.tableData.list = response.data
              this.tableData.total = response.total
            }
          })
      } catch (error) {
        console.error(error)
        ElMessage.error({ message: error.message, showClose: false })
      } finally {
        this.tableData.loading = false
      }
    },
    saveFileDate() {
      if (this.fileList.length && this.type) {
        http
          .post('/bankruptFile/saveBankruptFile', {
            companyId: this.companyId,
            projectId: this.projectId,
            businessTypeOne: this.type,
            fileName: this.fileList[0].fileName,
            filePath: this.fileList[0].filePath,
            userId: this.appStore.userInfo.userId,
            fileType: 1,
          })
          .then(response => {
            if (response.success) {
              this.getFileAll()

              this.fileVisible = false
            } else {
              ElMessage.error(response.msg)
            }
          })
      } else {
        ElMessage.error('请选择分类或上传资料！')
      }
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
    handleDel(val) {
      ElMessageBox.confirm(`确定删除该资料吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        http.post('/bankruptFile/deleteBankruptFile', {
          id: val.id,
        })
          .then(response => {
            if (response.success) {
              this.getFileAll()
            }
          })
      }).catch(e => e)
    },
  },
}
</script>
<style scoped>
.report {
  height: 100%;
  padding: 0 20px 20px;
}
.overview-title {
  height: 60px;
  line-height: 60px;
  color: #a69480;
  box-sizing: border-box;
  font-size: 14px;
}

.upload {
  float: right;
  margin-top: 15px;
  margin-left: 15px;
}
</style>
