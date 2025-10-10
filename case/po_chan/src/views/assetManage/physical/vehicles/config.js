export const MAIN_TYPE = 'physical'
export const SUB_TYPE = 'vehicles'
// 表单校验
export const rules = {
  assetsName: [{ required: true, message: '请输入车辆名称！' }],
  assetsNo: [{ required: true, message: '请输入车牌号！' }],
  assetsModel: [{ required: true, message: '请选择燃油类型！' }],
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
    label: '车辆名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入车辆名称' },
  },
  {
    label: '车牌号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入车牌号' },
  },
  {
    label: '燃油类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择燃油类型' },
    options: 'physical_vehicles_assets_model',
  },
  {
    label: '品牌型号',
    prop: 'assetsBrand',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入品牌型号' },
  },
  {
    label: '下次年检日期',
    prop: 'checkDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择下次年检日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '是否提醒',
    prop: 'alertStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择是否提醒', },
    options: [{ value: false, label: '否' }, { value: true, label: '是' }],

  },
  {
    label: '备注描述',
    prop: 'assetsRemark',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入描述', type: 'textarea', autosize: { minRows: 5 }, showWordLimit: true, maxlength: 1000 },
  },
  columnsFormFiles,
]
// 详情页字段
export const columnsDetails = [
  {
    label: '车辆名称',
    prop: 'assetsName',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入车辆名称' },
  },
  {
    label: '车牌号',
    prop: 'assetsNo',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入车牌号' },
  },
  {
    label: '燃油类型',
    prop: 'assetsModel',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择燃油类型' },
    options: 'physical_vehicles_assets_model',
  },
  {
    label: '品牌型号',
    prop: 'assetsBrand',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入品牌型号' },
  },
  {
    label: '下次年检日期',
    prop: 'checkDate',
    el: 'ElDatePicker',
    elAttrs: { placeholder: '请选择下次年检日期', type: 'date', valueFormat: 'YYYY-MM-DD' },
  },
  {
    label: '是否提醒',
    prop: 'alertStatus',
    el: 'ElSelect',
    elAttrs: { placeholder: '请选择是否提醒', },
    options: [{ value: false, label: '否' }, { value: true, label: '是' }],

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
  { prop: 'assetsName', label: '车辆名称' },
  { prop: 'assetsNo', label: '车牌号' },
  { prop: 'assetsBrand', label: '品牌类型' },
  { prop: 'assetsModel', label: '燃油类型' },
  { prop: 'checkDate', label: '下次年检日期' },
  { prop: 'vehiclesStatus', label: '状态' },
  { prop: 'chineseName', label: '登记人' },
  { prop: 'createTime', label: '登记时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
