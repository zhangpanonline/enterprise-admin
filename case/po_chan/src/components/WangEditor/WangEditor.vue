<template>
  <div>
    <Toolbar
      v-if="!disabled"
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{
        height: `${disabled ? (Number(height) - 40) : height}px`,
        overflow: 'hidden'
      }"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
// 文档地址：https://www.wangeditor.com/v5/for-frame.html#vue3
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  // 菜单栏
  toolbarConfig: {
    type: Object,
    default(rawProps) {
      return {}
    },
  },
  // 编辑器的配置
  editorConfig: {
    type: Object,
    default(rawProps) {
      return { placeholder: '请输入内容...' }
    },
  },
  // 编辑器的模式 default: 默认；simple：简单模式
  mode: {
    type: String,
    default: 'default',
  },
  // 是否禁用编辑器
  disabled: {
    type: Boolean,
    default: false,
  },
  // 编辑器高度
  height: {
    type: [String, Number],
    default: 200,
  },
})
const emit = defineEmits(['update:modelValue'])

// 内容 HTML
const valueHtml = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  if (props.disabled) editorRef.value.disable()
}
</script>
