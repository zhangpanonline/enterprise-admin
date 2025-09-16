<template>
  <el-dialog v-model="visible" title="插件上传" width="500px" @close="close">
    <el-form label-width="100" :model="form" :rules="rules" ref="formRef">
      <el-form-item label="选择文件" required>
        <p
          v-if="fileName"
          class="underline text-red-400 w-30 h-30 border border-gray-300 cursor-pointer rounded flex justify-center gap-1 items-center"
          title="删除"
          @click="((fileName = ''), file.delete('file'))"
        >
          <span>{{ fileName }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </p>
        <template v-else>
          <input type="file" class="hidden" id="upload" accept=".crx" @change="onChange" />
          <label
            class="w-30 h-30 border border-gray-300 text-gray-400 cursor-pointer rounded flex justify-center items-center"
            for="upload"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                clip-rule="evenodd"
              />
            </svg>
          </label>
        </template>
      </el-form-item>
      <el-form-item label="版本号" prop="name">
        <el-input v-model="form.name">
          <template #prepend> v </template>
          <template #append> .crx </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Extension } from './type.ts'

const emit = defineEmits(['ok'])

const rules = {
  name: [{ required: true, message: '请输入插件版本号！', trigger: 'blur' }],
}

const formRef = useTemplateRef('formRef')

const form = ref<Extension>({})

let file = new FormData()
let fileName = ref('')

const visible = defineModel<boolean>({
  default: false,
})

function close() {
  form.value.name = ''
  file = new FormData()
  fileName.value = ''
  formRef.value?.resetFields()
}

const onChange = (e: any) => {
  file = new FormData()
  file.append('file', e.target.files[0])
  fileName.value = e.target.files[0]['name']
  if (Array.isArray(fileName.value.match(/(\d\.)+/g))) {
    form.value.name = (fileName.value.match(/(\d\.)+/g) as string[])[0]
    form.value.name = form.value.name.slice(0, form.value.name.length - 1)
  }
}

function handleSave() {
  formRef.value?.validate().then(async (bool: boolean) => {
    if (!bool) return
    const res = await supabase.storage
      .from('chrome-extension')
      .upload('v' + form.value.name + '.crx', file as FormData, {
        cacheControl: '3600',
        upsert: false,
      })
    if (res.error) {
      return ElMessage.error(res.error.message || '操作失败！')
    }
    ElMessage.success('操作成功！')
    visible.value = false
    emit('ok')
  })
}
</script>
