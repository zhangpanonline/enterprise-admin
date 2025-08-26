<template>
    <div class="flex flex-col flex-1" >
        <header class="h-15 flex justify-between items-center px-5" >
            <div class="" >
                <el-input placeholder="请输入内容" v-model="search" @input="fetchData()" class="input-with-select" ></el-input>
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
    <RoleEdit v-if="showEdit" v-model="showEdit" v-model:rowData="rowData" @update="fetchData()" />
</template>

<script lang="ts" setup>
import Table from '@/shared/components/table/index.vue'
import { fetchRolesApi, deleteRoleApi, type Role } from '@/features/roles/api/role.api'
import RoleEdit from './RoleEdit.vue'

const showEdit = ref(false)
const rowData = ref({})
const columns = [
    {
        label: '角色名称',
        prop: 'name'
    },
    {
        label: '角色描述',
        prop: 'description'
    }, {
        label: '操作',
        prop: 'action'
    }
]
const tableData = reactive<{  list: Role[], limit: number, page: number, total: number, loading: boolean}>({
        list: [],
        limit: 100,
        page: 1,
        total: 0,
        loading: false,
})

const search = ref('')

fetchData()
async function fetchData(page = 1) {
    tableData.page = page
    const res = await fetchRolesApi({ name: search.value, page: tableData.page, limit: tableData.limit })
    if (res.status === 200) {
        tableData.list = res.data
    }
}

async function handleDelete(id: string) {
    ElMessageBox.confirm('确定删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const res = await deleteRoleApi(id)
        if (res.status === 204) {
            ElMessage.success('删除成功')
            fetchData()
        }
    })
}
</script>