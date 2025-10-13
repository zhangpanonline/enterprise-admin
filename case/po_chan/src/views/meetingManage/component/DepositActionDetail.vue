<template>
  <el-drawer
    :size="600"
    v-model="visible"
    title="签到统计"
    append-to-body>
    <div class="detail">
      <ul class="detail__info">
        <li>
          <span class="detail__key">债权人名称：</span>
          <span class="detail__val">陈敏</span>
        </li>
        <li>
          <span class="detail__key">修改人：</span>
          <span class="detail__val">陈敏昌昌</span>
        </li>
        <li>
          <span class="detail__key">操作时间：</span>
          <span class="detail__val">xxxx-xx-xx xx:xx:xx</span>
        </li>
        <li>
          <span class="detail__key">修改时间：</span>
          <span class="detail__val">陈敏</span>
        </li>
      </ul>
      <el-table :data="tableData" size="mini" stripe border style="width: 100%;">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="a" label="存证名称"></el-table-column>
        <el-table-column prop="b" label="存证人"></el-table-column>
        <el-table-column prop="c" label="公正时间"></el-table-column>
        <el-table-column prop="c" label="签到" width="80">
          <template #default>
            <span class="detail__sign">已签到</span>
          </template>
        </el-table-column>
      </el-table>
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
  </el-drawer>
</template>

<script>
export default {
  filters: {
    formatCNY(num) {
      if ([null, undefined, ''].includes(num)) num = 0
      const type = typeof num
      const options = { currency: 'CNY', style: 'currency' }
      if (type === 'string') {
        return Number.parseFloat(num).toLocaleString('zh-CN', options)
      } else if (type === 'number') {
        return num.toLocaleString('zh-CN', options)
      } else {
        return num
      }
    },
  },
  data() {
    return {
      visible: false,
      params: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      tableData: [
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
        { a: '会议的名称', b: '张宇', c: '2022-11-21 17:00:22' },
      ],
    }
  },
  methods: {
    fetchList(pageNum = 1) {

    },
  },
}
</script>

<style scoped>
.detail {
  padding: 0 20px;
  background-color: #fafafb;
  height: 100%;
  overflow: hidden auto;
  font-size: 14px;
}
.detail__info {
  padding: 12px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  line-height: 2em;
}
.detail__key {
  color: #666;
  display: inline-block;
  width: 6em;
  text-align-last: justify;
}
.detail__val {
  color: #333;
}
.detail__sign {
  display: block;
  height: 23px;
  border-radius: 23px;
  text-align: center;
  background-color: greenyellow;
}
</style>
