export const MAIN_TYPE = 'other'
export const SUB_TYPE = 'contract'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入合同名称！' }],
  assetsNo: [{ required: true, message: '请输入合同编号！' }],
  partyOne: [{ required: true, message: '请输入甲方！' }],
  partyTwo: [{ required: true, message: '请输入乙方！' }],
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
    label: '合同名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入合同名称' },
  },
  {
    label: '合同编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请选择合同编号' },
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额（元）' },
  },
  {
    label: '合同状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择合同状态' },
    options: 'other_contract_assets_status',
  },
  {
    label: '开始时间',
    prop: 'startDate',
    el: 'ElDatePicker',
    cols: 24,
    elAttrs: { placeholder: '请选择开始时间', type: 'daterange', valueFormat: 'YYYY-MM-DD' },
  },

  {
    label: '甲方',
    prop: 'partyOne',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入甲方' , maxlength: 30},
  },
  {
    label: '乙方',
    prop: 'partyTwo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入乙方' , maxlength: 30},
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
    label: '合同名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入合同名称' },
  },
  {
    label: '合同编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请选择合同编号' },
  },
  {
    label: '金额（元）',
    prop: 'assetsAmount',
    el: 'FormatCNY',
    elAttrs: { placeholder: '请输入金额（元）' },
  },
  {
    label: '合同状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择合同状态' },
    options: 'other_contract_assets_status',
  },
  {
    label: '开始时间',
    prop: 'startDate',
    el: 'ElDatePicker',
    cols: 12,
    elAttrs: { placeholder: '请选择开始时间', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '结束时间',
    prop: 'endDate',
    el: 'ElDatePicker',
    cols: 12,
    elAttrs: { placeholder: '请选择结束时间', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '甲方',
    prop: 'partyOne',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入甲方' , maxlength: 30},
  },
  {
    label: '乙方',
    prop: 'partyTwo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入乙方' , maxlength: 30},
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
  { prop: 'assetsName', label: '合同名称' },
  { prop: 'assetsNo', label: '合同编号' },
  { prop: 'assetsAmount', label: '金额(元)' },
  { prop: 'assetsStatusName', label: '合同状态' },
  { prop: 'startDate', label: '开始时间' },
  { prop: 'endDate', label: '结束时间' },
  { prop: 'partyOne', label: '甲方' },
  { prop: 'partyTwo', label: '乙方' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
