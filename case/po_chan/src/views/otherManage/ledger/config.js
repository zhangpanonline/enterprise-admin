export const MAIN_TYPE = 'other'
export const SUB_TYPE = 'ledger'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入印章名称！' }],
  assetsNo: [{ required: true, message: '请输入账簿编号！' }],
}
// 表单字段
const columnsFormFiles = reactive({
  label: '上传图片',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    limit: 1,
    extension: ['jpg', 'png', 'webP'],
    tips: '支持格式：.jpg .png .webP',
    text: '选择图片',
  },
})
export const columnsForm = [
  {
    label: '账簿名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿名称' },
  },
  {
    label: '账簿编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿编号' },
  },
  {
    label: '账簿类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择账簿类型' },
    options: 'other_ledger_assets_model',
  },
  {
    label: '账簿位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿位置' },
  },
  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '账簿名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿名称' },
  },
  {
    label: '账簿编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿编号' },
  },
  {
    label: '账簿类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择账簿类型' },
    options: 'other_ledger_assets_model',
  },
  {
    label: '账簿位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账簿位置' },
  },
  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  columnsFormFiles,
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },

  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsName', label: '账簿名称' },
  { prop: 'assetsNo', label: '账簿编号' },
  { prop: 'assetsModelName', label: '账簿类型' },
  { prop: 'address', label: '账簿位置' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
