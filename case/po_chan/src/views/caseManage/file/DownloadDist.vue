<template>
  <el-dialog v-model="visible" title="打包下载" custom-class="history" width="700px" top="10vh">
    <p style="padding-bottom: 10px;">请选择要下载的目录</p>
    <div>
      <el-tree
        ref="treeRef"
        :data="tree"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        highlight-current
        @check-change="check">
        <template v-slot="{ data }">
          <span style="font-size: 14px;">{{ data.fileName }}（{{ data.fileTotal }}）</span>
        </template>
      </el-tree>
      <div class="footer"><el-button type="primary" @click="download">打包下载</el-button></div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'fileName',
      },
    }
  },
  methods: {
    check(node, isCheck) {
      node.isCheck = isCheck
    },
    async getTree(projectId) {
      try {
        const res = await findFolderTreeApi({ projectId })
        this.tree = res.data
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    getIds(tree, ids) {
      tree.forEach(v => {
        if (v.isCheck) {
          ids.push(v.id)
        } else {
          if (Array.isArray(v.children)) {
            this.getIds(v.children, ids)
          }
        }
      })
    },
    async download() {
      try {
        const tree = this.$refs.treeRef.data
        const ids = []
        this.getIds(tree, ids)
        if (ids.length === 0) {
          ElMessage.error('请选择要下载的目录！')
          return false
        }
        ElMessage.success('已在后台下载，文件较大请耐心等待...')
        // sessionStorage.setItem(
        //   'downFiles',
        //   JSON.stringify(
        //     `[{"fileName":"案件资料汇总","code":"code${Date.now()}"}]`
        //   )
        // )
        // this.$store.commit('SET_DOWNFILESINNER')
        const res = await downloadCaseFileApi(ids.toString())
        const blob = new Blob([res])
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = '案件资料汇总.zip'
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      } finally {
        // sessionStorage.removeItem('downFiles')
        // if (this.$store.state.downFilesInner) {
        //   this.$store.commit('SET_DOWNFILESINNER')
        // }
      }
    },
  },
}
</script>

<style scoped>
.footer {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
