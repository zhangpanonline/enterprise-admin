export const MAIN_TYPE = 'knowledge'
export const SUB_TYPE = 'works'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入著作名称！' }],
  assetsNo: [{ required: true, message: '请输入登记号！' }],
  applyDate: [{ required: true, message: '请输入登记批准日期！' }],
  authUser: [{ required: true, message: '请输入著作权人！' }],
  authType: [{ required: true, message: '请选择权利取得方式！' }],
  assetsStatus: [{ required: true, message: '请选择著作状态！' }],
}

export const columnsForm = [
  {
    label: '著作名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入著作名称' },
  },
  {
    label: '登记号/流水号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入登记号/流水号' },
  },
  {
    label: '登记批准日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择登记批准日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '著作权人',
    prop: 'authUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入著作权人' },
  },
  {
    label: '著作完成日期',
    prop: 'developEndDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择著作完成日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '权利取得方式',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择权利取得方式' },
    options: 'knowledge_works_auth_type',
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '著作状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择著作状态' },
    options: 'knowledge_works_assets_status',
  },
]
// 详情页字段
export const columnsDetails = [
  {
    label: '著作名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入著作名称' },
  },
  {
    label: '登记号/流水号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入登记号/流水号' },
  },
  {
    label: '登记批准日期',
    prop: 'applyDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择登记批准日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '著作权人',
    prop: 'authUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入著作权人' },
  },
  {
    label: '著作完成日期',
    prop: 'developEndDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择著作完成日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '权利取得方式',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择权利取得方式' },
    options: 'knowledge_works_auth_type',
  },
  {
    label: '备注说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '著作状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择著作状态' },
    options: 'knowledge_works_assets_status',
  },
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsNo', label: '著作注册号' },
  { prop: 'assetsName', label: '著作名称' },
  { prop: 'debtorCompanyName', label: '著作持有企业' },
  { prop: 'authType', label: '著作类型' },
  { prop: 'applyDate', label: '著作权登记批准时间' },
  { prop: 'assetsStatus', label: '状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
