export const MAIN_TYPE = 'other'
export const SUB_TYPE = 'signet'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入印章名称！' }],
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
    label: '印章名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入印章名称' },
  },
  {
    label: '印章类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择印章类型' },
    options: 'other_signet_assets_model',
  },

  {
    label: '数量',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入数量' },
  },
  {
    label: '存放位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入存放位置' , maxlength: 30},
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
    label: '印章名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入印章名称' },
  },
  {
    label: '印章类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择印章类型' },
    options: 'other_signet_assets_model',
  },

  {
    label: '数量',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入数量' },
  },
  {
    label: '存放位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入存放位置' },
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
  { prop: 'assetsName', label: '印章名称' },
  { prop: 'assetsModelName', label: '印章类型' },
  // { prop: 'assetsNo', label: '印章编号' },
  { prop: 'address', label: '存放位置' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
