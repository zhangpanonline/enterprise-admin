<template>
  <el-form :rules="props.rules" :model="form" v-bind="$attrs" ref="formRef">
    <el-row :gutter="20">
      <template v-for="item in columns" :key="item.prop">
        <!-- 如果父组件里使用了插槽（插槽名为 #item.prop），则这里的 ElCol 不再展示 -->
        <slot v-if="$slots[item.prop]" :name="item.prop" v-bind="item" ></slot>
        <el-col v-else :span="item.cols || cols">
          <el-form-item :label="item.label" :prop="item.prop">
            <HuaweiObsUpload
              v-if="item.el === 'HuaweiObsUpload'"
              @returnFileList="e => form[item.prop] = e"
              @removeFile="e => deleteObsFileApi({ id: e.id })"
              v-bind="item.elAttrs"
              v-on="item.elEvent"
              >
              <div v-if="item.elAttrs.text || item.elAttrs.tips" class="flex flex-col items-start" >
                <el-button type="primary">
                  <ElIcon class="mr-3" ><IconEpUpload /></ElIcon>
                  {{ item.elAttrs.text || '上 传' }}
                </el-button>
                <p v-if="item.elAttrs.tips" class="text-xs text-info" >
                  {{ item.elAttrs.tips }}
                </p>
              </div>
            </HuaweiObsUpload>
            <component
              v-else
              :is="components[item.el]"
              v-model="form[item.prop]"
              v-bind="item.elAttrs">
              <template v-if="item.options" >
                <el-option
                  v-for="v in options[item.prop]['list']"
                  :key="v[options[item.prop]['value']]"
                  :value="v[options[item.prop]['value']]"
                  :label="v[options[item.prop]['label']]">
                </el-option>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup >
import WangEditor from '@/components/WangEditor/WangEditor.vue'
import FormatCNY from '@/components/FormatCNY/FormatCNY.vue'
import { deleteObsFileApi } from '@/api/index.js'
const props = defineProps({
  // 接收父组件传过来的初始值，即 v-model
  modelValue: {
    type: Object,
    required: true,
  },
  // 表单布局为几列，必须能被24整除
  cols: {
    type: [Number, String],
    default: 1,
  },
  /**
   * 表单字段描述，类型：Array<options = {}>
   * options = {
   *  label:    ElFormItem 的 label 属性
   *  prop:     ElFormItem 的 prop 属性
   *  isShow    是否展示当前 ElFormItem，默认 true
   *  cols:     当前FormItem 占 24 格中的几格，此属性优先级高 props.cols
   *
   *  el:       展示表单字段要使用的组件，可取值为ElementPlus所有的表单组件以及 /src/components/ 下的组件，例如：
   *            ElInput、WangEditor 等
   *  elEvent:  对象格式，对象里的方法都会展开传入到 options.el 对应的组件上
   *  elAttrs:  对象格式，对象里的属性都会展开传入到 options.el 对应的组件上，具体属性根据 options.el 的不同而变化
   *
   *  options:  下拉框\复选框\单选框等组件对应的选项,选项的汉字默认为label,选项的值默认为value
   *            类型为 Array,String,Object
   *            当为 String 时,表示为字典项,
   *            当为 Array 时,表示可以直接供组件消费的选项,格式如: [{ label: '男', value: 'man' }, { label: '女', value: 'woman' }]
   *            当为 Object 时,对应的属性有:
   *              type: dict | list
   *              label: 默认label
   *              value: 默认value
   *              list: []  // 当type 为 list 时使用这里的值
   *              dictCode: String // 当type 为 dict 时使用这里的值
   *
   *
   */
  columns: Array,
})
const emits = defineEmits(['update:modelValue'])
const form = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

// 表单组件
const components = {
  // 自定义组件
  'WangEditor': WangEditor,
  'FormatCNY': FormatCNY,
  // 'HuaweiObsUpload': HuaweiObsUpload,
  // element-plus 组件
  'ElCalendar': ElCalendar,
  'ElCascader': ElCascader,
  'ElCheckbox': ElCheckbox,
  'ElDatePicker': ElDatePicker,
  'ElInput': ElInput,
  'ElInputNumber': ElInputNumber,
  'ElRadio': ElRadio,
  'ElSelect': ElSelect,
  'ElSwitch': ElSwitch,
}

const cols = computed(() => {
  const num = Number(props.cols)
  return String(num) === 'NaN' ? 1 : (24 / num)
})

// 计算要展示哪些字段
const columns = computed(() => props.columns.filter(async v => {
  return v.isShow !== false
}))

// 处理文件上传的初始默认值
const cacheModelValue = JSON.stringify(toRaw(props.modelValue))
const stopWatch = watch(() => props.modelValue, () => {
  if (cacheModelValue === JSON.stringify(toRaw(props.modelValue))) return false
  // 如果没有id,则认为是新增,不再处理
  if (!Object.prototype.hasOwnProperty.call(props.modelValue, 'id')) {
    stopWatch()
    return false
  }
  for (const cur of columns.value) {
    if (cur.el === 'HuaweiObsUpload' && Array.isArray(props.modelValue[cur.prop])) {
      cur.elAttrs.inFileList = props.modelValue[cur.prop].map(v => ({ ...v, uid: v.id }))
    }
  }
  stopWatch()
}, {
  immediate: true,
  deep: true,
})

// 所有的下拉选项
const options = reactive({})
props.columns.forEach(async v => {
  if (v.options) {
    options[v.prop] = {
      label: 'label',
      value: 'value',
      list: [],
    }
    if (typeof v.options === 'string') {
      // 字典
      options[v.prop]['list'] = useDict(v.options)[v.options]
    } else if (Array.isArray(v.options)) {
      // 选项已经设置好,直接使用
      options[v.prop]['list'] = v.options
    } else if (Object.prototype.toString.call(v.options) === '[object Object]') {
      // 对象格式,可以更细粒度的设置
      const { type, label, value, list, dictCode } = v.options
      options[v.prop]['label'] = label
      options[v.prop]['value'] = value
      if (type === 'dict') {
        options[v.prop]['list'] = useDict(dictCode)[dictCode]
      } else if (type === 'list') {
        options[v.prop]['list'] = list
      }
    }
  }
})

const formRef = ref(null)
const formExposes = {}
onMounted(() => {
  formExposes.validate = formRef.value.validate
  formExposes.validateField = formRef.value.validateField
  formExposes.resetFields = formRef.value.resetFields
  formExposes.scrollToField = formRef.value.scrollToField
  formExposes.clearValidate = formRef.value.clearValidate
})

onBeforeUnmount(() => {
  for (const cur of columns.value) {
    if (cur.el === 'HuaweiObsUpload' && cur.elAttrs && Array.isArray(cur.elAttrs.inFileList)) {
      cur.elAttrs.inFileList.length = 0
    }
  }
})
defineExpose(formExposes)
</script>
