export const MAIN_TYPE = 'knowledge'
export const SUB_TYPE = 'soft'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入软著名称！' }],
  assetsNo: [{ required: true, message: '请输入申请号！' }],
  applyDate: [{ required: true, message: '请输入登记批准日期！' }],
  applyUser: [{ required: true, message: '请输著作权人！' }],
  address: [{ required: true, message: '请输入地址！' }],
  authType: [{ required: true, message: '请选择权利取得方式！' }],
  assetsStatus: [{ required: true, message: '请选择软著状态！' }],
}

export const columnsForm = [
  {
    label: '软著名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利名称' },
  },
  {
    label: '登记号/流水号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请号' },
  },
  {
    label: '登记批准日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择申请日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '证书号',
    prop: 'certNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入证书号' },
  },
  {
    label: '著作权人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入发明人，多个用分号隔开' },
  },
  {
    label: '地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入地址' },
  },
  {
    label: '开发完成日期',
    prop: 'developEndDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入开发完成日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '首次发表日期',
    prop: 'authDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入首次发表日期', type: 'date', valueFormat: 'YYYY-MM-DD' },

  },
  {
    label: '权利取得方式',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择' },
    options: 'knowledge_soft_auth_type',
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入备注说明', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '软著状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择软著状态' },
    options: 'knowledge_soft_assets_status',
  },
]
// 详情页字段
export const columnsDetails = [
  {
    label: '软著名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利名称' },
  },
  {
    label: '登记号/流水号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请号' },
  },
  {
    label: '登记批准日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择申请日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '证书号',
    prop: 'certNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入证书号' },
  },
  {
    label: '著作权人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入发明人，多个用分号隔开' },
  },
  {
    label: '地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入地址' },
  },
  {
    label: '开发完成日期',
    prop: 'developEndDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入开发完成日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '首次发表日期',
    prop: 'authDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入首次发表日期', type: 'date', valueFormat: 'YYYY-MM-DD' },

  },
  {
    label: '权利取得方式',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择' },
    options: 'knowledge_soft_auth_type',
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入备注说明', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '软著状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择软著状态' },
    options: 'knowledge_soft_assets_status',
  },
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsNo', label: '登记号/流水号' },
  { prop: 'assetsName', label: '软著名称' },
  { prop: 'companyName', label: '软著持有企业' },
  { prop: 'authType', label: '取得方式' },
  { prop: 'applyDate', label: '登记批准时间' },
  { prop: 'assetsStatus', label: '状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
