<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <el-card class="w-[360px]">
      <template #header>
        <div class="text-center text-lg font-bold">登录</div>
      </template>

      <el-form :model="form" ref="formRef" :rules="rules" label-position="top" @submit.prevent="onLogin">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password />
        </el-form-item>
        <el-button type="primary" class="w-full" :loading="loading" @click="onLogin">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../hooks/useLogin'

const formRef = ref()
const form = ref({
  email: '',
  password: ''
})
const rules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const { login, loading } = useLogin()

const onLogin = async () => {
  await formRef.value.validate()
  login(form.value)
}
</script>
