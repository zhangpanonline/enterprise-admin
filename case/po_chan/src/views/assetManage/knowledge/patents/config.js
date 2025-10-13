export const MAIN_TYPE = 'knowledge'
export const SUB_TYPE = 'patents'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入专利名称！' }],
  assetsNo: [{ required: true, message: '请输入申请号！' }],
  applyDate: [{ required: true, message: '请选择申请日期！' }],
  applyUser: [{ required: true, message: '请输发明人！' }],
  authUser: [{ required: true, message: '请输入专利权人！' }],
  address: [{ required: true, message: '请输入地址！' }],
  assetsRemark: [{ required: true, message: '请输入专利描述' }],
  authType: [{ required: true, message: '请选择类型！' }],
  assetsStatus: [{ required: true, message: '请选择专利状态！' }],
}

export const columnsForm = [
  {
    label: '专利名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利名称' },
  },
  {
    label: '申请号/专利号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请号' },
  },
  {
    label: '申请日期',
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
    label: '发明人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入发明人，多个用分号隔开' },
  },
  {
    label: '专利权人',
    prop: 'authUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利权人'},
  },
  {
    label: '地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入地址' },
  },
  {
    label: '授权公告日',
    prop: 'authDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入授权公告日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '授权公告号',
    prop: 'authNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入授权公告号' },
  },
  {
    label: '类型',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择' },
    options: 'knowledge_patents_auth_type',
  },
  {
    label: '专利说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入文件描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '专利状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择专利状态' },
    options: 'knowledge_patents_assets_status',
  },
]
// 详情页字段
export const columnsDetails = [
  {
    label: '专利名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利名称' },
  },
  {
    label: '申请号/专利号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入申请号' },
  },
  {
    label: '申请日期',
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
    label: '发明人',
    prop: 'applyUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入发明人，多个用分号隔开' },
  },
  {
    label: '专利权人',
    prop: 'authUser',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入专利权人'},
  },
  {
    label: '地址',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入地址' },
  },
  {
    label: '授权公告日',
    prop: 'authDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请输入授权公告日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '授权公告号',
    prop: 'authNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入授权公告号' },
  },
  {
    label: '类型',
    prop: 'authType',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择' },
    options: 'knowledge_patents_auth_type',
  },
  {
    label: '专利说明',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入文件描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 500 },
  },
  {
    label: '专利状态',
    prop: 'assetsStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择专利状态' },
    options: 'knowledge_patents_assets_status',
  },
]
// 分页表头字段
export const tableHeader = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '55' },
  { prop: 'assetsNo', label: '申请号/专利号' },
  { prop: 'assetsName', label: '专利名称' },
  { prop: 'authUser', label: '专利权人' },
  { prop: 'applyDate', label: '专利申请日期' },
  { prop: 'authDate', label: '授权公告日' },
  { prop: 'authNo', label: '授权公告号' },
  { prop: 'assetsStatus', label: '状态' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
