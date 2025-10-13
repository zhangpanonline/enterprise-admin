export const MAIN_TYPE = 'apply'
export const SUB_TYPE = 'reimbursement'
// 表单校验
export const rules = {
  applyAmount: [{ required: true, message: '请输入报销金额！' }],
  applyUser: [{ required: true, message: '请输入申请人！' }],
  applyDate: [{ required: true, message: '请选择报销时间！' }],
  assetsModel: [{ required: true, message: '请选择报销类型！' }],
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
    label: '报销金额（元）',
    prop: 'applyAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入报销金额' },
  },
  {
    label: '申请人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请人' },
  },

  {
    label: '报销时间',
    prop: 'applyDate',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入报销时间' },
  },
  {
    label: '报销类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择报销类型' },
    options: 'apply_reimbursement_assets_model',
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
    label: '报销金额（元）',
    prop: 'applyAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入报销金额' },
  },
  {
    label: '申请人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请人' },
  },

  {
    label: '报销时间',
    prop: 'applyDate',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入报销时间' },
  },
  {
    label: '报销类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择报销类型' },
    options: 'apply_reimbursement_assets_model',
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
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'createTime', label: '报销时间' },
  { prop: 'applyAmount', label: '金额（元）' },
  { prop: 'assetsModelName', label: '报销类型' },
  { prop: 'chineseName', label: '报销人' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
