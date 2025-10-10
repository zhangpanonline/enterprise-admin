export const MAIN_TYPE = 'knowledge'
export const SUB_TYPE = 'trademarks'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入商标名称！' }],
  assetsNo: [{ required: true, message: '请输入注册号！' }],
  applyDate: [{ required: true, message: '请选择申请日期！' }],
  authType: [{ required: true, message: '请输入国际分类！' }],
  assetsRemark: [{ required: true, message: '请输入文件描述！' }],
  certNo: [{ required: true, message: '请输入分类编号！' }],
  applyUser: [{ required: true, message: '请输入中文申请名称！' }],
  address: [{ required: true, message: '请输入中文申请人地址！' }],
  assetsShare: [{ required: true, message: '请选择是否共有商标！' }],
  assetsStatus: [{ required: true, message: '请选择商标状态！' }],
}
// 表单字段
const columnsFormFiles = reactive({
  label: '上传商标图片',
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
    label: '商标名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入商标名称' },
  },
  {
    label: '注册号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入注册号' },
  },
  {
    label: '申请日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择申请日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '国际分类',
    prop: 'authType',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入国际分类' },
  },
  {
    label: '产品服务',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产内容描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  {
    label: '分类编号',
    prop: 'certNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入分类编号，多个编号用逗号隔开' },
  },
  {
    label: '申请人名称',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入中文申请名称' },
  },
  {
    label: '申请人地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入中文申请人地址' },
  },
  {
    label: '是否共有商标',
    prop: 'assetsShare',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择是否共有商标' },
    options: [{ value: 0, label: '否' }, { value: 1, label: '是' }],
  },
  {
    label: '商标状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择商标状态' },
    options: 'knowledge_trademarks_assets_status',
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '商标名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入商标名称' },
  },
  {
    label: '注册号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入注册号' },
  },
  {
    label: '申请日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择申请日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '国际分类',
    prop: 'authType',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入国际分类' },
  },
  {
    label: '产品服务',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入资产内容描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  {
    label: '分类编号',
    prop: 'certNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入分类编号，多个编号用逗号隔开' },
  },
  {
    label: '申请人名称',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入中文申请名称' },
  },
  {
    label: '申请人地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入中文申请人地址' },
  },
  {
    label: '是否共有商标',
    prop: 'assetsShare',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择是否共有商标' },
    options: [{ value: false, label: '否' }, { value: true, label: '是' }],
  },
  {
    label: '商标状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择商标状态' },
    options: 'knowledge_trademarks_assets_status',
  },
  columnsFormFiles,
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsNo', label: '注册号' },
  { prop: 'assetsName', label: '商标名称' },
  { prop: 'authType', label: '国际分类' },
  { prop: 'certNo', label: '分类编号' },
  { prop: 'filePath', label: '商标图片' },
  { prop: 'applyDate', label: '申请日期' },
  { prop: 'companyName', label: '企业名称' },
  { prop: 'assetsStatus', label: '商标状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
