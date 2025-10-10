import { DICT_STORAGE } from '@/constant/index.js'
const dict = {}
// options 可以为 string array object
export default function useDict(options) {
  // 初始化值
  initData(options)
  // 获取数据
  setData(options)
  return dict
}
// 初始化为响应式数据
function initData(options) {
  if (typeof options === 'string') {
    dict[options] = ref([])
  } else if (Array.isArray(options)) {
    for (let i = 0; i < options.length; i++) {
      const obj = options[i]
      const typeStr = typeof obj
      if (typeStr === 'string') {
        dict[obj] = ref([])
      } else if (Object.prototype.toString.call(obj) === '[object Object]') {
        dict[obj.dictCode] = ref([])
      }
    }
  } else if (Object.prototype.toString.call(options) === '[object Object]') {
    dict[options.dictCode] = ref([])
  } else {
    throw Error('请求入参出错')
  }
}

// 获取数据
function setData(options) {
  if (typeof options === 'string') {
    getDict(options).then(res => {
      dict[options].value = res
    })
  } else if (Array.isArray(options)) {
    handleArr(options).then(res => {
      for (let i = 0; i < options.length; i++) {
        const obj = options[i]
        const typeStr = typeof obj
        if (typeStr === 'string') {
          dict[obj].value = res[i]
        } else if (Object.prototype.toString.call(obj === '[object Object]')) {
          dict[obj.dictCode].value = res[i]
        }
      }
    })
  } else if (Object.prototype.toString.call(options) === '[object Object]') {
    handleObj(options).then(res => {
      dict[options.dictCode].value = res
    })
  }
}

// 处理入参为对象格式的字典获取
async function handleObj(options) {
  const { dictCode, label, value } = options
  return await getDict(dictCode, { label, value })
}

// 处理入参为数组格式的字典获取
async function handleArr(options) {
  const promiseList = []
  for (let i = 0; i < options.length; i++) {
    const obj = options[i]
    const typeStr = typeof obj
    if (typeStr === 'string') {
      promiseList.push(getDict(obj))
    } else if (Object.prototype.toString.call(obj === '[object Object]')) {
      const { dictCode, label, value } = obj
      promiseList.push(getDict(dictCode, { label, value }))
    }
  }
  return await Promise.all(promiseList)
}

// 请求字典数据
async function getDict(code, opt = {}) {
  const storage = JSON.parse(sessionStorage.getItem(DICT_STORAGE))
  if (storage && storage[code]) {
    return storage[code]
  }
  try {
    const label = opt.label || 'label'
    const value = opt.value || 'id'
    const res = await getDictApi({ code })
    if (res.success) {
      const list = res.data.map(v => ({ label: v[label], value: v[value] }))
      sessionStorage.setItem(DICT_STORAGE, JSON.stringify({ ...storage, [code]: list }))
      return list
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}
