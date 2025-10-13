export const MAIN_TYPE = 'physical'
export const SUB_TYPE = 'articles'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入物品名称！' }],
  assetsNo: [{ required: true, message: '请输入物品编号！' }],
  assetsBrand: [{ required: true, message: '请输入品牌！' }],
}
// 表单字段
const columnsFormFiles = reactive({
  label: '上传图片',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    limit: 8,
    extension: ['jpg', 'png', 'webP'],
    tips: '支持格式：.jpg .png .webP',
    text: '选择图片',
  },
})
export const columnsForm = [
  {
    label: '物品名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入物品名称' ,maxlength: 30 },
  },
  {
    label: '物品编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入物品编号'},
  },
  {
    label: '品牌',
    prop: 'assetsBrand',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入品牌' },
  },

  {
    label: '型号',
    prop: 'assetsModel',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入型号' },
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额' },
  },
  {
    label: '数量',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入数量' },
  },
  {
    label: '单位',
    prop: 'assetsNumberUnit',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入单位' },
  },
  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '物品名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入物品名称' ,maxlength: 30 },
  },
  {
    label: '物品编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入物品编号'},
  },
  {
    label: '品牌',
    prop: 'assetsBrand',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入品牌' },
  },

  {
    label: '型号',
    prop: 'assetsModel',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入型号' },
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额' },
  },
  {
    label: '数量',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入数量' },
  },
  {
    label: '单位',
    prop: 'assetsNumberUnit',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入单位' },
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
  { prop: 'assetsName', label: '物品名称' },
  { prop: 'assetsNo', label: '物品编号' },
  { prop: 'assetsBrand', label: '品牌' },
  { prop: 'assetsModel', label: '型号' },
  { prop: 'assetsNumber', label: '数量' },
  { prop: 'assetsNumberUnit', label: '单位' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
