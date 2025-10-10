<template>
  <el-row :gutter="20">
    <template v-for="item in columns" :key="item.prop">
      <slot v-if="$slots[item.prop]" :name="item.prop" v-bind="item" ></slot>
      <el-col class="mb-4 !grid grid-cols-[120px_1fr]" v-else :span="item.cols || cols">
        <!-- 键名 -->
        <span class="text-info-550" >{{ item.label }}</span>
        <!-- 键值 -->
        <ul class="text-black" id="previewImage" v-if="item.el === 'HuaweiObsUpload' && transForm(item)">
          <template v-for="file in transForm(item)" :key="file.id">
            <li v-if="getFileType(file.filePath) === IMAGE"
              class="mb-2 mr-2 cursor-pointer inline-block w-25 h-25 border border-info-50
              bg-no-repeat bg-center bg-cover"
              :style="`background-image: url(${VITE_OBS_URL + file.filePath})`"
              @click="onPreview(file)">
            </li>
            <li v-else class="mb-2 flex items-center gap-1 underline text-primary">
              <img class="cursor-pointer" :src="fileIcon(file.filePath)" @click="downloadFile(file)" />
              <span class="cursor-pointer" @click="downloadFile(file)" >{{ file.fileName }}</span>
            </li>
          </template>
        </ul>
        <span v-else class="text-black" >{{ transForm(item) || '-' }}</span>
      </el-col>
    </template>
  </el-row>
</template>

<script setup>
// 图片类型，包含了jpg png svg webp jpeg gif
const IMAGE = 'IMAGE'
import { ICON, FILE_SUFFIX } from '@/constant'
import obsDownload from '@/components/HuaweiObsUpload/obsDownload.js'
const VITE_OBS_URL = import.meta.env.VITE_OBS_URL
// 要预览的图片列表
const priviewList = []
const { onPreviewImage } = usePreviewImage()
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
   *  label
   *  prop
   *  el
   *  isShow    是否展示默认 true
   *  cols:     当前字段占几列，此属性优先级高 props.cols
   *  elAttrs:  对象格式，对象里的属性用来判断如何渲染格式，同 Form组件里的elAttrs
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
// 计算布局为几列
const cols = computed(() => {
  const num = Number(props.cols)
  return String(num) === 'NaN' ? 1 : (24 / num)
})

// 计算要展示哪些字段
const columns = computed(() => props.columns.filter(async v => {
  return v.isShow !== false
}))

// 获取下拉选项
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

// 翻译字段
function transForm(v) {
  if (v.options) {
    if (typeof v.options === 'string' || Array.isArray(v.options)) {
      return options[v.prop]['list'].find(item => item.value === props.modelValue[v.prop])?.label || props.modelValue[v.prop]
    } else if (Object.prototype.toString.call(v.options) === '[object Object]') {
      const { label, value } = v.options
      const res = options[v.prop]['list'].find(item => item[value] === props.modelValue[v.prop])
      if (res && res[label]) {
        return res[label]
      } else {
        return props.modelValue[v.prop]
      }
    }
  } else if (v.el === 'ElDatePicker' && v.elAttrs.type === 'daterange') {
    if (Array.isArray(props.modelValue[v.prop])) {
      return props.modelValue[v.prop].join(' - ')
    } else {
      return props.modelValue[v.prop]
    }
  } else if (v.el === 'HuaweiObsUpload') {
    if (Array.isArray(props.modelValue[v.prop]) && props.modelValue[v.prop].length > 0) {
      priviewList.length = 0
      props.modelValue[v.prop].forEach(file => {
        if (getFileType(file.filePath) === IMAGE) {
          priviewList.push(file)
        }
      })
      const arr = JSON.parse(JSON.stringify(props.modelValue[v.prop]))
      arr.sort((a, b) => {
        const type_a = getFileType(a.filePath)
        const type_b = getFileType(b.filePath)
        if (type_a === IMAGE && type_b !== IMAGE) {
          return 1
        } else if (type_a !== IMAGE && type_b === IMAGE) {
          return -1
        } else {
          return 0
        }
      })
      return arr
    } else {
      return null
    }
  } else {
    return props.modelValue[v.prop]
  }
}
// 获取附件类型
function getFileType(path) {
  return FILE_SUFFIX[path.split('.')[1].toLowerCase()]
}
function fileIcon(path) {
  if (path) {
    const suffix = path.split('.')[1]
    return suffix ? ICON[FILE_SUFFIX[suffix.toLowerCase()]] : ICON['DEFAULT']
  } else {
    return ICON['FOLDER']
  }
}
function downloadFile({ filePath, fileName }) {
  ElMessage.success('开始下载，请稍等...')
  obsDownload(filePath, fileName)
}
function onPreview(file) {
  let index = 0
  const dataSource = priviewList.map((v, i) => {
    if (v.filePath === file.filePath) index = i
    return {
      url: VITE_OBS_URL + v.filePath,
      name: v.fileName,
    }
  })
  onPreviewImage(index, dataSource)
}

</script>
