export const MAIN_TYPE = 'other'
export const SUB_TYPE = 'writ'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入文书名称！' }],
  assetsNo: [{ required: true, message: '请输入文书编号！' }],
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
    label: '文书名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入文书名称' },
  },
  {
    label: '文书编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请选择文书编号' },
  },
  {
    label: '页数',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入页数' },
  },
  {
    label: '文书类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择文书类型' },
    options: 'other_writ_assets_model',
  },
  {
    label: '保密级别',
    prop: 'secrecyLevel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择保密级别' },
    options: 'other_writ_secrecy_level',
  },
  {
    label: '文书日期',
    prop: 'startDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择文书日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '存放位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入存放位置' , maxlength: 30},
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
    label: '文书名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入文书名称' },
  },
  {
    label: '文书编号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请选择文书编号' },
  },
  {
    label: '页数',
    prop: 'assetsNumber',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入页数' },
  },
  {
    label: '文书类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择文书类型' },
    options: 'other_writ_assets_model',
  },
  {
    label: '保密级别',
    prop: 'secrecyLevel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择保密级别' },
    options: 'other_writ_secrecy_level',
  },
  {
    label: '文书日期',
    prop: 'startDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择文书日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '存放位置',
    prop: 'address',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入存放位置' , maxlength: 30},
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
  { prop: 'assetsName', label: '文书名称' },
  { prop: 'assetsNo', label: '文书编号' },
  { prop: 'assetsModelName', label: '文书类型' },
  { prop: 'secrecyLevelName', label: '保密级别' },
  { prop: 'startDate', label: '文书日期' },
  { prop: 'address', label: '存放位置' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
