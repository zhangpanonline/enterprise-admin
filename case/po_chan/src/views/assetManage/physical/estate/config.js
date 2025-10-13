export const MAIN_TYPE = 'physical'
export const SUB_TYPE = 'estate'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入资产名称！' }],
  assetsNo: [{ required: true, message: '请输入资产编号！' }],
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
    label: '资产名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产名称' },
  },
  {
    label: '资产编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产编号' },
  },
  {
    label: '权利类型',
    prop: 'assetsBrand',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择权利类型' },
    options: 'physical_estate_assets_brand',
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额（元）' },
  },
  {
    label: '资产位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产位置' },
  },

  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '资产名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产名称' },
  },
  {
    label: '资产编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产编号' },
  },
  {
    label: '品牌',
    prop: 'assetsBrand',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择品牌' },
    options: 'physical_estate_assets_brand',
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额（元）' },
  },
  {
    label: '资产位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产位置' },
  },

  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  columnsFormFiles,
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsName', label: '资产名称' },
  { prop: 'assetsNo', label: '资产编号' },
  { prop: 'assetsBrand', label: '权利类型' },
  { prop: 'assetsAmount', label: '金额（元）' },
  { prop: 'address', label: '资产位置' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
