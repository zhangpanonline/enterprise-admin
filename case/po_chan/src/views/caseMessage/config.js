export const MAIN_TYPE = 'knowledge'
export const SUB_TYPE = 'trademarks'


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
// 详情页字段
export const columnsDetails = [
  {
    label: '消息内容',
    prop: 'content',
    el: 'ElInput',
    cols: 24,
    elAttrs: { placeholder: '请输入商标名称' },
  },
  // {
  //   label: '创建人',
  //   prop: 'assetsNo',
  //   el: 'ElInput',
  //   elAttrs: { placeholder: '请输入注册号' },
  // },
  {
    label: '创建时间',
    prop: 'createTime',
    el: 'ElInput',
    elAttrs: { placeholder: '请输入分类编号，多个编号用逗号隔开' },
  },
  columnsFormFiles
]
// 分页表头字段
export const tableHeader = [
  { type: 'index', label: '序号', width: '55' },
  { prop: 'content', label: '消息内容' },
  { prop: 'extras', label: '附件' },
  // { prop: 'assetsName', label: '创建人' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'caozuo', label: '操作', fixed: 'right' },
]
