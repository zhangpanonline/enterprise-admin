<template>
    <el-dialog v-model="visible" title="Edit User" width="30%" >
        <el-form :model="form">
            <el-form-item label="用户名">
            <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="邮箱">
            <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="密码">
            <el-input v-model="form.password" />
            </el-form-item>
            <el-form-item label="角色">
            <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="handleCrateUser">保存</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { fetchRolesApi, type Role } from '@/features/roles/api/role.api'
import { createUserApi } from '@/features/users/api/user.api'

const emit = defineEmits(['update'])

const visible = defineModel<boolean>({
    default: false,
})
const roleList = ref<Role[]>([])

// getRoleList()
async function getRoleList() {
const res = await fetchRolesApi({})
    if (res.status === 200) {
        roleList.value = res.data
    }
}
async function handleCrateUser() {
    // const res = await createUserApi(form)
    // if (res.code === 200) {
    //     ElMessage.success('创建成功')
    // }
    emit('update')
}



const form = reactive({
  name: '',
  email: '',
  password: '',
  roles: []
})
    
</script>