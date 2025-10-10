<template>
  <div class="table">
    <el-input v-model="params.creditorName" class="table__search" size="mini" placeholder="搜索债权人" @input="() => fetchList()" />
    <el-select v-model="params.natureOne" class="table__search--right" placeholder="请选择债权性质" size="mini" clearable @change="fetchList()">
      <el-option v-for="v in natureClaim" :key="v.value" :label="v.label" :value="v.value"></el-option>
    </el-select>
    <!-- <el-button class="table__valid" icon="el-icon-postcard" type="primary" size="mini" @click="onValidVote()">无效投票</el-button> -->
    <el-table v-loading="loading" :data="data" size="mini" stripe border style="width: 100%">
      <el-table-column prop="creditorNum" label="债权人编号" min-width="80"></el-table-column>
      <el-table-column prop="creditorName" label="债权人名称" min-width="150"></el-table-column>
      <el-table-column prop="creditorPhone" label="电话号码" min-width="100"></el-table-column>
      <el-table-column prop="socialCreditCode" label="身份证号" min-width="150"></el-table-column>
      <el-table-column min-width="100" prop="natureOneName" label="债权性质">
        <template v-slot="scope">
          <span
            :class="{
              table__around: true,
              'table__around--success': scope.row.natureOne === '0',
              'table__around--info': scope.row.natureOne === '1',
              'table__around--primary': scope.row.natureOne === '2',
              'table__around--primary1': scope.row.natureOne === '3',
              'table__around--warning': scope.row.natureOne === '4',
              'table__around--error': scope.row.natureOne === '5',
              'table__around--other': scope.row.natureOne === '6',
              'table__around--popur': scope.row.natureOne === '7'
          }">{{ scope.row.natureOneName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="confirmTotal" label="认定金额-总额" min-width="100">
        <template v-slot="scope">{{ formatCNY(scope.row.confirmTotal) }}</template>
      </el-table-column>
      <el-table-column label="投票时间" min-width="150">
        <template v-slot="scope">
          {{ scope.row.voteTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column width="110" label="投票结果">
        <template v-slot="scope">
          <span v-if="isSave" :class="['table__vote', voteColor(scope.row.voteOption)]">{{ formatVote(scope.row.voteOption) }}</span>
          <el-select v-else :class="['table__vote', voteColor(scope.row.voteOption)]" :value="formatVote(scope.row.voteOption)" @change="e => updateSigned(scope.row, e)">
            <el-option v-for="v in getVoteList(scope.row.voteOption)" :key="v.value" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div class="table__pagination">
      <el-pagination
        :current-page="params.pageNum"
        :page-size="20"
        :total="total"
        background
        layout="total, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        @current-change="fetchList($event)" />
    </div>
    <VoteValid ref="voteValidRef" />
  </div>
</template>

<script>
import VoteValid from './VoteValid.vue'
import { NATURE_CLAIM } from '@/constant'
export default {
  components: { VoteValid },
  setup() {
    const { formatCNY } = useFormatMoney()
    function formatVote(n) {
      if (n === 1) {
        return '同意'
      } else if (n === 0) {
        return '不同意'
      } else if (n === 2) {
        return '弃权'
      } else {
        return '未投票'
      }
    }
    return { formatCNY, formatVote }
  },
  props: {
    cardInfo: {
      type: Object,
      required: true,
    },
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
      params: {
        pageNum: 1,
        pageSize: 20,
        creditorName: '',
        natureOne: '', // 债权性质
      },
      total: 0,
      data: [],
      loading: false,
    }
  },
  computed: {
    natureClaim() {
      if (this.cardInfo.voteNature) {
        return NATURE_CLAIM.filter(({ value }) => this.cardInfo.voteNature.includes(value))
      } else {
        return NATURE_CLAIM
      }
    },
  },
  created() {
    this.fetchList()
  },
  methods: {
    voteColor(n) {
      if (n === 1) {
        return 'table__around--success'
      } else if (n === 0) {
        return 'table__around--error'
      } else if (n === 2) {
        return 'table__around--warning'
      } else {
        return 'table__around--other'
      }
    },
    async fetchList(pageNum = 1) {
      try {
        this.loading = true
        const params = {
          ...this.params,
          pageNum,
          projectId: this.row.projectId,
          voteId: this.cardInfo.voteId,
        }
        const res = await meetVoteListApi(params)
        if (res.success) {
          this.data = res.data.records
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
    onValidVote() {
      this.$refs.voteValidRef.visible = true
      this.$refs.voteValidRef.params.projectId = this.row.projectId
      this.$refs.voteValidRef.params.voteId = this.cardInfo.voteId
      this.$refs.voteValidRef.fetchList()
    },
    getVoteList(n) {
      if (n === 0) {
        return [
          { label: '同意', value: 1 },
          { label: '弃权', value: 2 },
          { label: '未投票', value: null },
        ]
      } else if (n === 1) {
        return [
          { label: '不同意', value: 0 },
          { label: '弃权', value: 2 },
          { label: '未投票', value: null },
        ]
      } else if (n === 2) {
        return [
          { label: '不同意', value: 0 },
          { label: '同意', value: 1 },
          { label: '未投票', value: null },
        ]
      } else {
        return [
          { label: '不同意', value: 0 },
          { label: '同意', value: 1 },
          { label: '弃权', value: 2 },
        ]
      }
    },
    // 修改签到状态
    async updateSigned(row, newOption) {
      const { voteOption: oldOption, creditorId, creditorName } = row
      const _this = this
      ElMessageBox.confirm(`修改债权人 ${creditorName} 投票结果！`, '确认修改？', {
        type: 'warning',
        async callback(flag) {
          if (flag !== 'confirm') return false
          try {
            const res = await meetVoteUpdateApi({ creditorId, voteId: _this.cardInfo.voteId, newOption, oldOption })
            if (res.success) {
              _this.fetchList()
              _this.$emit('refresh')
            } else {
              ElMessage.error(res.msg)
            }
          } catch (error) {
            console.error(error)
            ElMessage.error(error.message || '服务器出错，请重试！')
          }
        },
      })
    },
  },
}
</script>
<style scoped>
:deep(.table__vote) {
  border-radius: 23px;
  display: block;
  text-align: center;
}
.el-input input {
  height: 23px;
  border: none;
  background: transparent;
}
.el-input .el-input__suffix {
  top: 8px;
}
.el-input .el-input__suffix  .el-select__caret {
  color: #000;
}
.table {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.table__search {
  width: 200px;
  position: absolute;
  right: 635px;
  top: -35px;
  z-index: 2;
}
.table__search--right {
  width: 200px;
  position: absolute;
  top: -35px;
  z-index: 2;
  right: 415px;
}
.el-table {
  height: calc(100% - 45px);
}
:deep(.el-table .el-table__body-wrapper) {
  height: calc(100% - 36px);
  overflow: hidden auto;
}
.table__pagination {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-pagination {
  margin: 0;
}
.table__around {
  display: block;
  height: 23px;
  border-radius: 23px;
  text-align: center;
}
.table__around--success {
  background-color: #bcf4c5;
}
.table__around--info {
  background-color: #d9d9d9;
}
.table__around--primary {
  background-color: #cde9ff;
}
.table__around--primary1 {
  background-color: #a3cff0;
}
.table__around--warning {
  background-color: #fff2cd;
}
.table__around--error {
  background-color: #ffdef0;
}
.table__around--other {
  background-color: #bccbf3;
}
.table__around--popur {
  background-color: #e6ddff;
}
</style>
