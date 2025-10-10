export const MAIN_TYPE = 'apply'
export const SUB_TYPE = 'other'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入车辆名称！' }],
  assetsNo: [{ required: true, message: '请输入车牌号！' }],
  assetsModel: [{ required: true, message: '请选择燃油类型！' }],
}
// 表单字段
const columnsFormFiles = reactive({
  label: '上传附件',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    limit: 1,
    extension: ['rar', 'zip', 'doc','docx','pdf'],
    tips: '支持格式：.rar .zip .doc .docx .pdf',
    text: '选择附件',
  },
})
export const columnsForm = [
  {
    label: '账户名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入 账户名称' },
  },
  {
    label: '账号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账号' },
  },
  {
    label: '开户银行',
    prop: 'bankName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入开户银行' },
  },
  {
    label: '账户类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择账户类型' },
    options: 'other_ledger_assets_model',
  },
  {
    label: '账户金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入账户金额' },
  },

  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '账户名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入 账户名称' },
  },
  {
    label: '账号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入账号' },
  },
  {
    label: '开户银行',
    prop: 'bankName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入开户银行' },
  },
  {
    label: '账户类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择账户类型' },
    options: 'other_ledger_assets_model',
  },
  {
    label: '账户金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入账户金额' },
  },

  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  columnsFormFiles,
]
// 分页表头字段
export const tableHeader = [
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsNo', label: '账号' },
  { prop: 'bankName', label: '开户银行' },
  { prop: 'assetsName', label: '账户名称' },
  { prop: 'assetsModel', label: '账户类型' },
  { prop: 'assetsAmount', label: '账户金额（元）' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
