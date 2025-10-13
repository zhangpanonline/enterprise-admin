/**
 * @param {Array<String>} opts
 * @param {Boolean} bool
 * @returns { buttonAuth }
 * @example
 * 获取新增按钮权限
 * import { CREATE_BUTTON } from '@/constant'
 * const { buttonAuth } = useButtonAuth([CREATE_BUTTON])
 * 在模板中使用
 * v-if="buttonAuth[CREATE_BUTTON]"
 */
export default function useButtonAuth(opts, bool = true) {
  const appStore = useAppStore()
  const route = useRoute()
  const obj = reactive({})
  watch(() => appStore.buttonAuth[route.path], auth => {
    for (const key in obj) obj[key] = false
    const res = opts.reduce((acc, cur) => {
      // EXAMPLE
      // acc[cur] = auth?.includes(cur) && bool
      acc[cur] = true
      return acc
    }, {})
    Object.assign(obj, res)
  }, {
    immediate: true,
    deep: true,
  })
  console.log(obj, '按钮权限')
  return { buttonAuth: obj }
}
