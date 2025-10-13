export const MAIN_TYPE = 'apply'
export const SUB_TYPE = 'payment'
// 表单校验
export const rules = {
  applyAmount: [{ required: true, message: '请输入付款金额！' }],
  assetsName: [{ required: true, message: '请输入收款名称！' }],
  bankName: [{ required: true, message: '请选择开户银行！' }],
  assetsNo: [{ required: true, message: '请选择银行账号！' }],
}
// 表单字段
const columnsFormFiles = reactive({
  label: '上传附件',
  prop: 'files',
  el: 'HuaweiObsUpload',
  cols: 24,
  elAttrs: {
    limit: 1,
    extension: ['rar', 'zip', 'doc', 'docx', 'pdf'],
    tips: '支持格式：.rar .zip .doc .docx .pdf',
    text: '选择附件',
  },
})
export const columnsForm = [
  {
    label: '付款金额（元）',
    prop: 'applyAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入付款金额' },
  },
  {
    label: '大写',
    prop: 'bigMoney',
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '收款名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入收款名称' },
  },

  {
    label: '开户银行',
    prop: 'bankName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入开户银行' },
  },
  {
    label: '银行账号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入银行账号' },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '付款金额（元）',
    prop: 'applyAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入付款金额' },
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '收款名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入收款名称' },
  },

  {
    label: '开户银行',
    prop: 'bankName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入开户银行' },
  },
  {
    label: '银行账号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入银行账号' },
  },
  columnsFormFiles,
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'createTime', label: '申请时间' },
  { prop: 'applyAmount', label: '金额（元）' },
  { prop: 'assetsName', label: '收款账户' },
  { prop: 'assetsNo', label: '银行账号' },
  { prop: 'bankName', label: '开户行' },
  { prop: 'chineseName', label: '申请人' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
