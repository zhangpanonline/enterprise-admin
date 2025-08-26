<template>
  <el-dialog v-model="visible" title="Edit Role" width="30%" @close="close">
    <el-form :model="form">
      <el-form-item label="角色名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleCrateUser">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createRoleApi, editRoleApi, type Role } from "@/features/roles/api/role.api";

const emit = defineEmits(["update"]);

const form = defineModel<Role>('rowData', {
  default: () => ({ name: "", description: "" })
})

const visible = defineModel<boolean>({
  default: false,
});

function close() {
  form.value = { name: "", description: "" }
}

async function handleCrateUser() {
  const api = form.value.id ? editRoleApi : createRoleApi
  const msg = form.value.id ? "修改成功" : "创建成功"
  const res = await api(form.value)
  if (res.status === 201) {
    ElMessage.success(msg)
    emit("update");
    visible.value = false
  }
}


</script>
