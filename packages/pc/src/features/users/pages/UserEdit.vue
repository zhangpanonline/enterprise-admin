<template>
  <el-dialog v-model="visible" title="Edit User" width="30%" @close="close">
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="密码">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input :disabled="!!form.id" v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roles" multiple placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleCrateUser">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  createUserApi,
  editUserApi,
  type User,
} from "@/features/users/api/user.api";
import { fetchRolesApi, type Role } from "@/features/roles/api/role.api";

const emit = defineEmits(["update"]);

const form = defineModel<User>("rowData", {
  default: () => ({ email: "", password: "", name: "", phone: "", roles: [] }),
});

const visible = defineModel<boolean>({
  default: false,
});

function close() {
  form.value = { email: "", password: "", name: "", phone: "", roles: [] };
}

const roleList = ref<Array<Required<Role>>>([]);

getRoleList();
async function getRoleList() {
  const res = await fetchRolesApi({ page: 1, limit: 100 });
  if (res.status === 200) {
    roleList.value = res.data;
  }
}

async function handleCrateUser() {
  const api = form.value.id ? editUserApi : createUserApi;
  const msg = form.value.id ? "修改成功" : "创建成功";
  console.log(form.value, '####')
  const res = await api(form.value);
  if (res.status === 200) {
    ElMessage.success(msg);
    emit("update");
    visible.value = false;
  }
}
</script>
