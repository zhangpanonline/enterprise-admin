<template>
  <el-dialog v-model="visible" custom-class="video" title="无效投票" width="500px">
    <el-table v-if="visible" :data="tableData" size="mini" stripe border height="500px" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="voteUserName" label="用户名"></el-table-column>
      <el-table-column prop="votePhone" label="投票手机号"></el-table-column>
      <el-table-column prop="voteOption" label="无效投票">
        <template #default="scope">
          {{ formatVote(scope.row.voteOption) }}
        </template>
      </el-table-column>
    </el-table>
    <div v-if="visible" class="save__pagination" >
      <el-pagination
        :current-page="params.pageNum"
        :page-size="20"
        :total="total"
        background
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        @current-change="fetchList($event)"/>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      params: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      tableData: [],
      loading: false,
    }
  },
  methods: {
    formatVote(n) {
      if (n === 1) {
        return '同意'
      } else if (n === 0) {
        return '不同意'
      } else if (n === 2) {
        return '弃权'
      } else {
        return '未投票'
      }
    },
    async fetchList(pageNum = 1) {
      try {
        this.loading = true
        const res = await meetVoteValidApi({ ...this.params, pageNum })
        if (res.success) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message || '服务器出错，请重试！')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style scoped >
.video {
  padding: 20px;
}
.save__pagination {
  height: 50px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}
.el-pagination {
  margin: 0;
}
</style>
