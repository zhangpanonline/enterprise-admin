<template>
  <div class="cus_page_header">
    {{ $route.meta.title }}
  </div>
  <div class="h-full-14 bg-white">
    <div class="wrap">
      <div class="aside">
        <div class="aside__resize"></div>
        <div class="aside__line"></div>
        <div class="aside__content">
          <el-input
            v-model="search"
            placeholder="请输入文件夹名称"
            style="width: 220px;"
            clearable>
            <template #suffix>
              <el-icon>
                <IconEpSearch />
              </el-icon>
            </template>
          </el-input>
          <el-tree ref="treeRef" :default-expanded-keys="defaultExpandedKeys" :data="computedTree" node-key="id" :props="defaultProps" @current-change="ondeExpand">
            <template v-slot="{ data }">
              <span style="font-size: 14px;">{{ data.fileName }}（{{ data.fileTotal }}）</span>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="file_list">
        <!-- 顶部搜索区域 -->
        <header class="header">
          <HuaweiObsUpload
            v-if="showCreate"
            :show-file-list="false"
            system-type="dept"
            style="float: right;"
            temp-file="tempFile"
            @returnFile="onUploadOk"
          >
            <el-button type="primary">
              <template #icon><el-icon><IconEpDocumentAdd /></el-icon></template>
              上传资料
            </el-button>
          </HuaweiObsUpload>
          <el-button
            type="primary"
            style="float: right; margin-right: 20px;"
            @click="onHistroy()"
          >
          <template #icon><el-icon><IconEpDocument /></el-icon></template>
          历史记录
          </el-button>
          <el-button
            v-if="showCreate"
            style="float: right; margin-right: 20px;"
            type="primary"
            @click="onCreate()"
          >
          <template #icon><el-icon><IconEpFolderAdd /></el-icon></template>
          新建文件夹</el-button>
          <el-button
            v-if="showDownload"
            style="float: right; margin-right: 20px;"
            type="primary"
            @click="onDlownloadDist"
          >
          <template #icon><el-icon><IconEpFolderAdd /></el-icon></template>
          打包下载</el-button>
        </header>
        <!-- 文件夹、文件列表 -->
        <main class="main">
          <p
            v-for="v in fileList"
            :key="v.id"
            :style="{ cursor: v.folderType === 1 ? 'pointer' : 'default' }"
            class="main_file"
          >
            <template v-if="v.isEdit">
              <figure>
                <img
                  :src="
                    icon[v.type] === icon.IMAGE
                      ? getObsUrl(v.filePath)
                      : icon[v.type] || icon.DEFAULT
                  "
                  :title="v.name"
                  :alt="v.name"
                />
                <figcaption class="main_file_name">
                  <el-input
                    ref="inputRef"
                    v-model="v.fileName"
                    class="main_file_name_input"
                    @keyup.enter="
                      $refs.inputRef[0].$el.firstElementChild.blur()
                    "
                    @blur="onCreateFolder(v)"
                  />
                </figcaption>
              </figure>
            </template>
            <template v-else>
              <figure
                @click="onDbClickFile(v)"
                @click.right.prevent="onRightFile(v, $event)"
              >
                <img
                  v-if="icon[v.type] === icon.IMAGE"
                  :src="getObsUrl(v.filePath)"
                  :title="v.name"
                  :alt="v.name"
                  :preview-text="v.name"
                  preview="1"
                />
                <img
                  v-else
                  :src="icon[v.type] || icon.DEFAULT"
                  :title="v.name"
                  :alt="v.name"
                />
                <figcaption :title="v.fileName" class="main_file_name">
                  {{ v.name }}
                </figcaption>
              </figure>
            </template>
          </p>
        </main>
        <!-- 分页 -->
        <div class="file_pagination">
          <el-pagination
            :current-page="searchParams.pageNum"
            :page-sizes="[100, 200, 300]"
            :page-size="100"
            :total="totalCount"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="
              $event => {
                searchParams.pageSize = $event;
                getFileList();
              }
            "
            @current-change="
              $event => {
                searchParams.pageNum = $event;
                getFileList();
              }
            "
          />
        </div>
      </div>
    </div>

    <!-- 右键文件弹出更多操作 -->
    <div v-if="isShowMenu" class="menu_box" :style="{'left': menuLeft + 'px', 'top': menuTop + 'px'}">

      <!-- <el-popover ref="popoverRef" :visible="showPopover" placement="bottom-start"> -->
        <div class="contextmenu min-h-[100px]">
          <el-icon class="el-icon-close  mr-[6px] mt-[6px]" title="关闭" @click.prevent="isShowMenu = false"> <IconEpClose /> </el-icon>
          <p v-if="showDownload" @click="onDownload()">下载</p>
          <p @click="showDataAttar()">属性</p>
          <p v-if="showRename" @click="onRename()">重命名</p>
          <p v-if="showDelete" style="color: red;" @click="onDel()">删除</p>
        </div>
      <!-- </el-popover> -->
    </div>
    <History ref="historyRef" />
    <DownloadDist ref="downloadDistRef" />
  </div>
</template>

<script>
import DownloadDist from './DownloadDist.vue'
import obsFileDownload from '@/components/HuaweiObsUpload/obsDownload.js'
import History from './History.vue'
import {
  MANAGE,
  SUPERVISE,
  DEBTOR,
  FILE_SUFFIX,
  ICON,
  AUTH_LAW_CREATER,
  AUTH_LAW_MANAGER,
  AUTH_PCDSFJG,
  AUTH_PCZWR,
  AUTH_THIRD_PARTY
} from '@/constant'
const NEW = 'new'
const ALL = 1
export default {
  components: { History, DownloadDist },
  setup() {
    const appStore = useAppStore()
    const { caseInfo, caseRole } = storeToRefs(useCaseStore())
    const historyRef = ref(null)
    const downloadDistRef = ref(null)
    const popoverRef = ref(null)
    function getObsUrl(path) {
      return import.meta.env.VITE_OBS_URL + path
    }
    return { appStore, historyRef, downloadDistRef, popoverRef, getObsUrl, caseInfo, caseRole }
  },
  data() {
    return {
      ALL,
      searchParams: {
        // createUser: '', // 当前登录用户id，仅开发测试时使用
        fileName: '',
        id: 1,
        pageSize: 100,
        pageNum: 1,
        status: 0, // 0 正常；-3 删除
        // "folderType":"文件类型 1:文件夹 2:文件"
      },
      // 文件处理权限，0无权限 1下载，2删除，3都可
      filePermission: 0,
      totalCount: 0,
      // 重命名时，缓存之前的名字
      preName: '',
      showPopover: true,
      icon: ICON,
      // 文件夹、文件列表
      fileList: [],
      // 记录面包屑
      breadcrumb: [],
      selectFile: {},
      tree: [],
      search: '',
      defaultProps: {
        children: 'children',
        label: 'fileName',
      },
      menuLeft: 0,
      menuTop: 0,
      isShowMenu: false,
      defaultExpandedKeys: [],
    }
  },
  computed: {
    // 权限说明：【腾讯文档】权限消息说明 https://docs.qq.com/sheet/DZE5JeFRWWU9MZGJT?tab=lmjhfj
    // 是否为三方
    isBankruptThirdParty() {
      const authorities = this.appStore.authorities || []
      return authorities.some(v => v === AUTH_THIRD_PARTY)
    },
    // 是否为债务人
    isPCZWR() {
      const authorities = this.appStore.authorities || []
      return authorities.some(v => v === AUTH_PCZWR)
    },
    // 是否为法院
    isPCDSFJG() {
      const authorities = this.appStore.authorities || []
      return authorities.some(v => v === AUTH_PCDSFJG)
    },
    // 是否为管理人团队
    isManage() {
      return this.caseRole.org === MANAGE
    },
    // 管理人团队是否有下载权限
    isManageDownload() {
      return this.isManage && [1, 3].includes(this.filePermission)
    },
    // 管理人团队是否有删除权限
    isManageDel() {
      return this.isManage && this.filePermission >= 2
    },
    // 当前是否为顶级目录
    isTop() {
      return this.breadcrumb.length === 0
    },
    curDir() {
      if (this.breadcrumb.length === 0) {
        return {}
      } else {
        return this.breadcrumb[this.breadcrumb.length - 1]
      }
    },
    // 0: 债务人资料
    // 1: 模板附件（申报模板里的文件）
    // 2: 债权人资料
    // 3: 公开文件
    // 4: 监督机构资料
    // 5: 自定义上传的资料
    // 9: 第三方

    // 上传文件、新建文件夹
    showCreate() {
      if (this.curDir.fileType === 0) {
        return this.isManage || this.isPCZWR
      } else if (this.curDir.fileType === 1) {
        return this.isManage
      } else if (this.curDir.fileType === 2) {
        return false
      } else if (this.curDir.fileType === 3) {
        return true
      } else if (this.curDir.fileType === 4) {
        return this.isManage || this.isPCDSFJG
      } else if (this.curDir.fileType === 5) {
        return this.isManage
      } else if (this.curDir.fileType === 9) {
        return this.isManage || this.isBankruptThirdParty
      } else {
        return false
      }
    },
    // 重命名
    showRename() {
      if (this.isTop && this.curDir.fileType !== 5) {
        return false
      } else if (this.curDir.fileType === 0) {
        return this.isManage || this.isPCZWR
      } else if (this.curDir.fileType === 1) {
        return this.isManage
      } else if (this.curDir.fileType === 2) {
        return false
      } else if (this.curDir.fileType === 3) {
        return true
      } else if (this.curDir.fileType === 4) {
        return this.isManage || this.isPCDSFJG
      } else if (this.curDir.fileType === 5) {
        return this.isManage
      } else if (this.curDir.fileType === 9) {
        return this.isManage || this.isBankruptThirdParty
      } else {
        return false
      }
    },
    // 下载
    showDownload() {
      if (this.curDir.fileType === 0) {
        return this.isManageDownload || this.isPCZWR
      } else if (this.curDir.fileType === 1) {
        return this.isManageDownload
      } else if (this.curDir.fileType === 2) {
        return this.isManageDownload
      } else if (this.curDir.fileType === 3) {
        return this.isManageDownload
      } else if (this.curDir.fileType === 4) {
        return this.isManageDownload || this.isPCDSFJG
      } else if (this.curDir.fileType === 5) {
        return this.isManage
      } else if (this.curDir.fileType === 9) {
        return this.isManageDownload || this.isBankruptThirdParty
      } else {
        return false
      }
    },
    showDelete() {
      if (this.curDir.fileType === 0) {
        return this.isManageDel || this.isPCZWR
      } else if (this.curDir.fileType === 1) {
        return this.isManageDel
      } else if (this.curDir.fileType === 2) {
        return false
      } else if (this.curDir.fileType === 3) {
        return this.isManageDel
      } else if (this.curDir.fileType === 4) {
        return this.isManageDel || this.isPCDSFJG
      } else if (this.curDir.fileType === 5) {
        return this.isManage
      } else if (this.curDir.fileType === 9) {
        return this.isManageDel || this.isBankruptThirdParty
      } else {
        return false
      }
    },
    // 律所人可以查看所有文件
    isLaw() {
      // bankrupt_law_manager 破产-律所管理员
      // bankrupt_law_creater 破产-律所创建人
      const authorities = [AUTH_LAW_CREATER, AUTH_LAW_MANAGER]
      return this.appStore.authorities.some((v) => authorities.includes(v))
    },
    computedTree() {
      if (this.search) {
        const list = []
        this.searchTree(list, this.tree)
        return list
      } else {
        return this.tree
      }
    },
  },
  created() {
    this.searchParams.id = 1
    this.getOne()
    this.getFileList()
    this.getTree()
  },
  mounted() {
    document.addEventListener('click', this.clickPopoverOut)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.clickPopoverOut)
  },
  methods: {
    async getOne() {
      try {
        const res = await getbankruptManagerOneApi(this.caseInfo.projectId)
        if (res.success) {
          if (res.data) {
            this.filePermission = Number(res.data.filePermission)
          } else {
            this.filePermission = 0
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    searchTree(list, tree) {
      tree.forEach(v => {
        if (v.fileName.includes(this.search)) {
          list.push(v)
        } else {
          if (Array.isArray(v.children)) {
            this.searchTree(list, v.children)
          }
        }
      })
    },
    onDlownloadDist() {
      this.downloadDistRef.visible = true
      this.downloadDistRef.getTree(this.caseInfo.projectId)
    },
    clickPopoverOut(e) {
      this.isShowMenu = false
      if (!this.popoverRef) return false
      const flag = this.popoverRef.popperRef.contentRef.contains(
        e.target
      )
      // if (!flag) this.showPopover = false
      if (!flag) this.isShowMenu = false
    },
    async getTree() {
      try {
        const res = await findFolderTreeApi({ projectId: this.caseInfo.projectId })
        this.tree = this.handleTree(res.data)
        this.defaultExpandedKeys = this.breadcrumb.map(v => v.id)
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    handleTree(tree) {
      return tree.map(v => {
        // folderType  1:文件夹 2:文件"
        if (v.folderType === 1) {
          v.type = 'FOLDER'
        }
        v.name = v.fileName.split('.')[0]
        const suffix = v.fileName.split('.')[1]
        if (suffix) v.type = FILE_SUFFIX[suffix]
        if (Array.isArray(v.children)) {
          v.children = this.handleTree(v.children)
        }
        return v
      })
    },
    async getFileList(pageNum = 1) {
      try {
        this.searchParams.pageNum = pageNum
        const res = await getFileListApi({
          projectId: this.caseInfo.projectId,
          ...this.searchParams,
        })
        if (res.success) {
          this.fileList = res.data.map(v => {
            // folderType  1:文件夹 2:文件"
            if (v.folderType === 1) {
              v.type = 'FOLDER'
            }
            v.name = v.fileName.split('.')[0]
            const suffix = v.fileName.split('.')[1]
            if (suffix) v.type = FILE_SUFFIX[suffix]
            return v
          })
          this.totalCount = res.pages
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 新建文件夹
    onCreate() {
      if (this.fileList.some(v => v.isEdit)) return false
      this.fileList.push({
        id: NEW,
        fileName: '',
        type: 'FOLDER',
        isEdit: true,
      })
      this.preName = '' // 清空 preName 字段，否则提交时，会认为是重命名
      this.$nextTick(() => {
        this.$refs.inputRef[0].$el.firstElementChild.focus()
      })
    },
    // 保存新建的文件夹 && 重命名
    async onCreateFolder(folder) {
      try {
        if (!folder.fileName) {
          if (folder.id === NEW) {
            this.fileList.pop()
          } else {
            folder.fileName = this.preName
            folder.isEdit = false
          }
          return false
        }
        const curDir = this.breadcrumb[this.breadcrumb.length - 1]
        const params = {
          projectId: this.caseInfo.projectId,
          userId: this.appStore.userInfo.userId,
          fileType: curDir ? curDir.fileType : 5,
          companyId: this.caseInfo.companyId,
          folderType: 1,
          folderParentId: curDir ? curDir['id'] : 1,
          fileList: [{ fileName: folder.fileName.trim(), filePath: '' }],
        }
        // 重命名
        if (this.preName) {
          const res = await renameCaseFileNameApi({
            id: folder.id,
            fileName: folder.fileName.trim(),
          })
          if (res.success) {
            this.searchParams.id = curDir ? curDir['id'] : 1
            this.getFileList()
            ElMessage.success('操作成功！')
          } else {
            if (
              this.$refs.inputRef[0] &&
              this.$refs.inputRef[0].$el.firstElementChild
            ) {
              this.$refs.inputRef[0].$el.firstElementChild.focus()
            }
            console.error(res)
            ElMessage.error(res.msg)
          }
        } else {
          // 新建文件夹、文件
          const res = await addCaseFileApi({ ...params, sourType: 1 })
          if (res.success) {
            this.searchParams.id = curDir ? curDir['id'] : 1
            this.getFileList()
            this.getTree()
            ElMessage.success('操作成功！')
          } else {
            if (
              this.$refs.inputRef[0] &&
              this.$refs.inputRef[0].$el.firstElementChild
            ) {
              this.$refs.inputRef[0].$el.firstElementChild.focus()
            }
            console.error(res)
            ElMessage.error(res.msg)
          }
        }
      } catch (error) {
        if (
          this.$refs.inputRef[0] &&
          this.$refs.inputRef[0].$el.firstElementChild
        ) {
          this.$refs.inputRef[0].$el.firstElementChild.focus()
        }
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 右键文件
    onRightFile(file, e) {
      this.selectFile = file
      this.showPopover = true
      // const dom = this.popoverRef.popperRef.contentRef
      this.isShowMenu = true
      this.$nextTick(() => {
        // dom.style.position = 'fixed'
        // dom.style.top = e.pageY + 'px'
        // dom.style.left = e.pageX + 'px'
        this.menuLeft = e.pageX
        this.menuTop = e.pageY
      })
    },
    ondeExpand(file) {
      if (file.fileType === 0) {
        // 管理人团队、债务人可以访问债务人资料
        if ([MANAGE, DEBTOR].includes(this.caseRole.org) || this.isLaw) {
          this.searchParams.id = file.id
          this.getFileList()
          if (!this.searchParams.fileName) {
            this.breadcrumb.push(file)
          }
        } else {
          ElMessage.warning('您没有访问权限！')
        }
      } else if (file.fileType === 4) {
        // 管理人团队、监督机构可以访问监管资料
        if ([MANAGE, SUPERVISE].includes(this.caseRole.org) || this.isLaw) {
          this.searchParams.id = file.id
          this.getFileList()
          if (!this.searchParams.fileName) {
            this.breadcrumb.push(file)
          }
        } else {
          ElMessage.warning('您没有访问权限！')
        }
      } else if (file.fileType === 2) {
        // 管理人团队可以访问债权人资料
        if (this.isManage || this.isLaw) {
          this.searchParams.id = file.id
          this.getFileList()
          if (!this.searchParams.fileName) {
            this.breadcrumb.push(file)
          }
        } else {
          ElMessage.warning('您没有访问权限！')
        }
      } else {
        this.searchParams.id = file.id
        this.getFileList()
        if (!this.searchParams.fileName) {
          this.breadcrumb.push(file)
        }
      }
    },
    // 双击文件夹、文件
    onDbClickFile(file) {
      if (file.type === 'FOLDER') {
        this.ondeExpand(file)
      } else {
        const imgs = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'pdf']
        const files = ['doc', 'docx']
        let testmsg = String(file.filePath).substring(
          String(file.filePath).lastIndexOf('.') + 1
        )
        testmsg = testmsg.toLowerCase()
        if (imgs.indexOf(testmsg) > -1) {
          return false
        }
        if (files.indexOf(testmsg) > -1) {
          if (this.appStore.userInfo.juUserId1) {
            window.open(
              location.origin +
                '/look/ntko/look.html?url=' +
                file.filePath +
                '&companyId=' +
                this.appStore.userInfo.companyId
            )
            return
          }
          window.open(
            location.origin +
              '/look/webOfficeZs/openReadOffice.html?obsUrl=' + this.getObsUrl(file.filePath)
          )
          return
        }
        ElMessage.warning('暂不支持该文件直接查看，建议下载！')
      }
    },
    async onDownload() {
      if (this.selectFile.folderType === 2) {
        obsFileDownload(this.selectFile.filePath, this.selectFile.fileName)
      } else {
        try {
          const res = await downloadCheckCaseFileApi(this.selectFile.id)
          if (res.success) {
            ElMessage.success('已在后台下载，文件较大请耐心等待...')
            const res = await downloadCaseFileApi(this.selectFile.id)
            if (res.status === 200) {
              const blob = new Blob([res])
              const a = document.createElement('a')
              const url = window.URL.createObjectURL(blob)
              a.href = url
              a.download = this.selectFile.name + '.zip'
              a.click()
              window.URL.revokeObjectURL(url)
            }
          } else {
            console.error(res)
            ElMessage.error(res.msg)
          }
        } catch (error) {
          console.error(error)
          ElMessage.error(error.message)
        }
      }
    },
    async showDataAttar() {
      try {
        const res = await getCaseFileAttrApi({ id: this.selectFile.id })
        if (res.success) {
          const {
            fileName,
            createUser,
            updateUser,
            updateTime,
          } = res.data
          const message = `
            <p style="color: #666; line-height: 2.5em; text-indent: 1em;" >名称：<span style="color: #a69480;" >${fileName ||
              '-'}</span><p>
            <p style="color: #666; line-height: 2.5em; text-indent: 1em;" >创建人：<span style="color: #a69480;" >${createUser ||
              '-'}</span><p>
            <p style="color: #666; line-height: 2.5em; text-indent: 1em;" >最后编辑人：<span style="color: #a69480;" >${updateUser ||
              '-'}</span><p>
            <p style="color: #666; line-height: 2.5em; text-indent: 1em;" >最后修改时间：<span style="color: #a69480;" >${updateTime ||
              '-'}</span><p>
          `
          ElMessageBox({
            title: '属性',
            dangerouslyUseHTMLString: true,
            message,
            showConfirmButton: false,
          })
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    onRename() {
      this.selectFile.isEdit = true
      // this.showPopover = false
      this.isShowMenu = false
      this.preName = this.selectFile.fileName
      this.$nextTick(() => {
        this.$refs.inputRef[0].$el.firstElementChild.focus()
      })
    },
    async onDel() {
      try {
        const confirm = await ElMessageBox.confirm('确认删除此文件？', '提示', {
          type: 'warning',
        })
        if (confirm !== 'confirm') return false
        const res = await updateCaseFileStatueApi({
          id: this.selectFile.id,
          status: -3,
          sourType: 1,
        })
        if (res.success) {
          const curDir = this.breadcrumb[this.breadcrumb.length - 1]
          this.searchParams.id = curDir ? curDir['id'] : 1
          this.showPopover = false
          this.getFileList()
          this.getTree()
          ElMessage.success('操作成功！')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 上传资料
    async onUploadOk(fileList) {
      try {
        const curDir = this.breadcrumb[this.breadcrumb.length - 1]
        const params = {
          projectId: this.caseInfo.projectId,
          fileList: [fileList],
          folderType: 2,
          companyId: this.caseInfo.companyId,
          userId: this.appStore.userInfo.userId,
          folderParentId: curDir ? curDir['id'] : 1,
          fileType: curDir ? curDir.fileType : 5,
        }
        const res = await addCaseFileApi({ ...params, sourType: 1 })
        if (res.success) {
          this.searchParams.id = curDir ? curDir['id'] : 1
          this.getFileList()
          this.getTree()
          ElMessage.success('操作成功！')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    // 返回上一级
    onGoBack() {
      this.breadcrumb.pop()
      const len = this.breadcrumb.length - 1
      if (len === -1) {
        this.searchParams.id = ALL
      } else {
        this.searchParams.id = this.breadcrumb[len]['id']
      }
      this.getFileList()
    },
    // 跳转会任意层级
    onGoTo({ id }) {
      if (id === ALL) {
        this.breadcrumb = []
        this.searchParams.id = id
      } else {
        const index = this.breadcrumb.findIndex(v => v.id === id)
        if (index === -1) return false
        this.searchParams.id = this.breadcrumb[index]['id']
        this.breadcrumb = this.breadcrumb.slice(0, index + 1)
      }
      this.getFileList()
    },
    onHistroy() {
      this.historyRef.visible = true
      this.historyRef.projectId = this.caseInfo.projectId
      this.historyRef.getList()
    },
  },
}
</script>

<style scoped>
.wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  padding-top: 20px;
  box-sizing: border-box;
}
.aside {
  position: relative;
  height: 100%;
}
.aside__resize {
  height: inherit;
  overflow: scroll;
  resize: horizontal;
  min-width: 250px;
  max-width: 500px;
  opacity: 1;
  background-color: #f1f1f1;
}
.aside__resize::-webkit-scrollbar {
  height: 100vh;
}
.aside__line {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  border-right: 2px solid #f1f1f1;
  pointer-events: none;
  box-sizing: border-box;
  z-index: 1000;
  background-color: #fff;
}
.aside__content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc(100% - 10px);
  background-color: #fff;
  padding: 0 0 20px 20px;
  overflow: hidden auto;
}
.file_list {
  height: 100%;
  overflow: hidden;
  float: left;
  padding: 0 20px 20px;
  flex: 1;
}
/* 右键菜单列表 */
.contextmenu {
  position: relative;
  padding: 0;
  box-sizing: border-box;
  color: #666;
  font-size: 14px;
  line-height: 2.5em;
  text-indent: 1em;
  padding-top: 20px;
  background: #fff;
  /* border-right: 2px solid #f1f1f1; */
}
.contextmenu > p:hover {
  cursor: pointer;
  color: #a69480;
  background: #f1f1f1;
}
.el-icon-close {
  position: absolute;
  top: -3px;
  right: -3px;
}
.el-icon-close:hover {
  color: red;
  cursor: pointer;
}
.header {
  height: 30px;
  gap: 20px;
  box-sizing: border-box;
  padding: 0 20px;
}
.header::after {
  content: "";
  clear: both;
  display: block;
}
.main {
  height: calc(100% - 70px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  grid-template-rows: repeat(auto-fill, calc(72px + 1em));
  gap: 20px;
}
.main_file figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
.main_file figure img {
  width: 50px;
  height: 50px;
}
.main_file figure :deep(.main_file_name_input > .el-input__inner) {
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
}
.main_file figure :deep(.main_file_name_input > .el-input__inner):focus {
  background: #faf8f8;
}
.main_file figure .main_file_name {
  text-align: center;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.file_pagination {
  height: 40px;
  display: flex;
  justify-content: flex-end;
}
.el-pagination {
  margin: 0;
}
.menu_box{
   position: fixed;
   width: 100px;
   border: 1px solid #f1f1f1;
}
</style>
