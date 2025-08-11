<template>
  <div>
    <el-button @click="showDialog = true" >创建用户</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roles" label="角色" />
    </el-table>
    <EditUser v-if="showDialog" v-model="showDialog" @update="fetchData" ></EditUser>
  </div>
</template>

<script lang="ts" setup>
import { getUserApi } from '@/features/users/api/user.api'
import EditUser from './EditUser.vue'


const showDialog = ref(false)

const search = reactive({
    name: '',
    page: 1,
    limit: 10
})

const tableData = ref([])

fetchData()
async function fetchData() {
    tableData.value = []
    const res = await getUserApi(search)
    if (res.status === 200) {
        tableData.value = res.data
    }
}


</script>