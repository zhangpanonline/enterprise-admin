/**
 * 搭配表格分页组件（/components/Table.vue），对查询和删除进行的封装
 */
const tableData = reactive({
  list: [],
  pageSize: 10,
  pageNum: 1,
  total: 0,
  loading: true,
})

// 删
function delData({ api, id, callback } = {}) {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    async callback(confirm) {
      if (confirm !== 'confirm') return false
      try {
        const res = await api(id)
        if (res.success) {
          ElMessage.success('操作成功！')
          return Promise.resolve(callback && callback())
        } else {
          ElMessage.warning(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.warning(error.message)
      }
    },
  })
}
// 查
async function fetchData({ api, pageNum = 1, params = {}, callback } = {}) {
  try {
    tableData.loading = true
    tableData.pageNum = pageNum
    const res = await api({ ...params, pageNum, pageSize: tableData.pageSize })
    if (res.success) {
      tableData.list = res.data.records
      tableData.total = res.data.total
      callback && callback(res)
    } else {
      ElMessage.error({ message: res.msg })
    }
  } catch (error) {
    console.error(error)
    ElMessage.error({ message: error.message })
  } finally {
    tableData.loading = false
  }
}

// 查找api，增改api，删除api
export default function useTable() {
  return { tableData, fetchData, delData }
}
