<template>
    <div class="flex flex-col flex-1" >
        <header class="h-15 flex justify-between items-center px-5" >
            <div class="" >
            </div>
            <el-button type="primary" @click="showEdit = true">新增</el-button>
        </header>
        <Table class="flex-1" :columns="columns" :data="tableData" @fetchData="fetchData">
            <template #action="{ row }">
                <el-button size="small" plain @click="rowData = row; showEdit = true">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
            </template>
        </Table>
    </div>
    <UserEdit v-if="showEdit" v-model="showEdit" v-model:rowData="rowData" @update="fetchData()" />
</template>

<script lang="ts" setup>
import Table from '@/shared/components/table/index.vue'
import { getUsersApi, type User } from '@/features/users/api/user.api'
import UserEdit from './UserEdit.vue'

const showEdit = ref(false)
const rowData = ref({})
const columns: Array<{ prop: keyof User | 'action', label: string }> = [
    {
        label: '用户',
        prop: 'name'
    },
    {
        label: '邮箱',
        prop: 'email'
    }, {
        label: '手机号',
        prop: 'phone'
    },
    {
        label: '角色',
        prop: 'roles'
    },
    {
        label: '操作',
        prop: 'action'
    }
]
const tableData = reactive<{  list: User[], limit: number, page: number, total: number, loading: boolean}>({
        list: [],
        limit: 100,
        page: 1,
        total: 0,
        loading: false,
})


fetchData()
async function fetchData(page = 1) {
    tableData.page = page
    const res = await getUsersApi({ page: tableData.page, limit: tableData.limit })
    console.log(res, '###')
    if (res.status === 200) {
        tableData.list = res.data
        tableData.total = res.total
    } else {
        console.error('TODO', res)
        // ElMessageBox.confirm(
        //     msg,
        //     error?.response?.status || 'Error',
        //     {
        //         confirmButtonText: 'OK',
        //         showCancelButton: false,
        //         type: 'error',
        //     }
        // )
    }
}

async function handleDelete(id: string) {
    ElMessageBox.confirm('确定删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        // const res = await deleteRoleApi(id)
        // if (res.status === 204) {
        //     ElMessage.success('删除成功')
        //     fetchData()
        // }
    })
}
</script>