<template>
  <div class="vote">
    <div class="vote__header">
      <span
        v-if="!isCard"
        class="vote__back"
        title="返回"
        @click="isCard = true"
        ><i class="el-icon-arrow-left"></i
      ></span>
      <span class="vote__title" @click="isCard = true">{{
        isCard ? "全部决议投票通道" : cardInfo.voteName
      }}</span>
    </div>
    <template v-if="isCard">
      <div v-loading="loading" class="vote__card-list">
        <VoteCard
          v-for="v in cardList"
          :key="v.voteId"
          :card="v"
          @click="onCard(v)"
        />
        <p v-if="cardList.length === 0" class="relative left-full cus_empty">
        </p>
      </div>
      <div class="vote__card-pagination">
        <el-pagination
          v-if="cardTotal"
          :current-page="params.pageNum"
          :page-size="12"
          :total="cardTotal"
          background
          layout="total, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          @current-change="fetchList($event)"
        />
      </div>
    </template>
    <div v-else class="vote__detail">
      <VoteTable
        :card-info="cardInfo"
        :row="row"
        :is-save="isSave"
        @refresh="$refs.analyseRef.fetchData()"
      />
      <VoteAnalyse ref="analyseRef" :card-info="cardInfo" :row="row" />
    </div>
  </div>
</template>

<script>
import VoteAnalyse from './component/VoteAnalyse.vue'
import VoteCard from './component/VoteCard.vue'
import VoteTable from './component/VoteTable.vue'
export default {
  components: { VoteAnalyse, VoteCard, VoteTable },
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
      isCard: true,
      cardInfo: {},
      cardList: [],
      params: {
        pageNum: 1,
        pageSize: 12,
      },
      cardTotal: 0,
      loading: false,
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    // 分页
    async fetchList(pageNum = 1) {
      try {
        this.loading = true
        const params = {
          ...this.params,
          pageNum,
          projectId: this.row.projectId,
          meetCode: this.row.meetCode,
        }
        const res = await meetVotePageApi(params)
        if (res.success) {
          this.cardList = res.data.records
          this.cardTotal = res.data.total
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
    onCard(v) {
      this.cardInfo = v
      this.isCard = false
    },
  },
}
</script>

<style scoped>
.vote {
  padding: 12px 20px 0;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
}
.vote__header {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
}
.vote__back {
  margin-right: 0.5em;
  cursor: pointer;
}
.vote__back:hover {
  color: #a6948a;
}
.vote__title {
  font-size: 18px;
  cursor: pointer;
}
.vote__title:hover {
  color: #a6948a;
}
.vote__card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 15px;
  overflow: hidden auto;
  height: calc(100% - 90px);
}
.vote__card-pagination {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-pagination {
  margin: 0;
}
.vote__detail {
  height: calc(100% - 40px);
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 15px;
  box-sizing: border-box;
  /* 这里的position被VoteTable 下的 .table__search 依赖 */
  position: relative;
}
</style>
