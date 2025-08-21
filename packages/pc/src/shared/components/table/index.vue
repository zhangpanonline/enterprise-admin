<template>
  <div class="h-full"
    v-loading="data.loading"
    element-loading-spinner="loading-animation"
    element-loading-background="rgba(255, 255, 255, 0.8)" >
    <el-table
      :data="data.list"
      highlight-current-row
      row-key="id"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      v-bind="$attrs">
      <el-table-column v-if="selection" v-bind="selection" ></el-table-column>
      <el-table-column v-for="v in columnList" :key="v.prop" :show-overflow-tooltip="v.prop !== 'caozuo'" v-bind="v">
        <template v-if="$slots[v.prop]" #default="{ row, column, $index }">
          <slot :name="v.prop" v-bind="{ row, column, $index }" ></slot>
        </template>
        <template v-else #default="scope">
          {{ handleData(scope, v) }}
        </template>
      </el-table-column>
      <template #empty>
        <div class="cus_empty w-full h-full" ></div>
      </template>
    </el-table>
    <el-pagination
      v-if="data.total"
      class="h-15 justify-end"
      :current-page="data.page"
      :page-size="data.limit"
      :page-sizes="[10, 20, 30, 50]"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :total="data.total"
      @size-change="$event => $emit('sizeChange', $event)"
      @current-change="$event => $emit('fetchData', $event)"
      @prev-click="$event => $emit('fetchData', $event - 1)"
      @next-click="$event => $emit('fetchData', $event + 1)"
    />
  </div>
</template>

<script lang="ts" setup>
// ??? 这里columns不解构，为什么也可以直接使用？
const { data, columns } = defineProps({
  // 表头
  columns: {
    type: Object,
    default() { return [] },
  },
  // 表格和分页的数据
  data: {
    type: Object,
    default() {
      return {
        list: [],
        limit: 10,
        page: 1,
        total: 0,
        loading: true,
      }
    },
  },
})
const columnList = computed(() => columns.filter((v: any) => v.type !== 'selection'))
// 是否有行选择复选框
const selection = computed(() => columns.find((v: any) => v.type === 'selection'))
// 表头样式
function headerCellStyle() {
  return { background: 'var(--primary-color-50)', color: '#333', height: '60px' }
}
// 行样式
function rowStyle({ rowIndex }: { rowIndex: number }) {
  if (rowIndex % 2 === 1) {
    return { background: 'var(--primary-color-50)', color: '#333', height: '56px' }
  } else {
    return { color: '#333', height: '56px' }
  }
}
// 处理数据为空的情况
function handleData({ row, $index }: { row: any, $index: number }, v: any) {
  if (typeof row[v.prop] === 'number') {
    return row[v.prop]
  } else if (v.type === 'index') {
    return $index + 1
  } else {
    return row[v.prop] || '-'
  }
}
</script>

<style scoped>
.el-table {
  /* 边框颜色 */
  --el-table-border-color: transparent;
  /* 行选中颜色 */
  --el-table-current-row-bg-color: var(--primary-color-100);
  --el-table-row-hover-bg-color: var(--primary-color-100);
  height: calc(100% - 60px);
}
:deep(.el-scrollbar__view) {
  height: 100%;
}
:deep(.el-table__empty-text) {
  display: block;
  height: 100%;
  width: 100%;
}
:deep(.el-popper) {
  max-width: 500px;
  background-color: #3b6976ef;
  border-color: var(--primary-color-300);
  font-size: 14px;
  line-height: 1.5em;
  overflow: hidden auto;
  max-height: 300px;
}
:deep(.el-popper .el-popper__arrow::before) {
  background-color: #3b6976ef;
  border-color: var(--primary-color-300);
}
</style>
