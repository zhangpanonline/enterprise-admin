<template>
  <Form v-model="form" :rules="rules" :columns="columns" :cols="2" label-width="110" />
</template>

<script setup >
const form = reactive({
  custodianCompanyName: '', // 管理人
  caseNumber: '', // 案号
  debtorCompanyName: '', // 债务人
  announcementType: '', // 公告分类
  announcementDate: '', // 公告时间
  declareEndDate: '', // 申报截止时间
  announcementTitle: '', // 公告标题
  announcementContent: '', // 公告内容
})
const rules = {
  custodianCompanyName: [{ required: true, message: '请输入' }],
  caseNumber: [{ required: true, message: '请输入' }],
  debtorCompanyName: [{ required: true, message: '请输入' }],
  announcementType: [{ required: true, message: '请输入' }],
  announcementDate: [{ required: true, message: '请输入' }],
  declareEndDate: [{ required: true, message: '请输入' }],
  announcementTitle: [{ required: true, message: '请输入' }],
  announcementContent: [{ required: true, message: '请输入' }],
}
const toolbarConfig = { excludeKeys: ['uploadImage', 'uploadVideo', 'emotion', 'insertImage', 'group-image', 'editImage', 'insertLink', 'insertVideo'] }
const columns = [
  {
    label: '管理人',
    prop: 'custodianCompanyName',
    el: 'ElInput',
    elAttrs: {
      placeholder: '请输入管理人',
    },
  },
  {
    label: '公告时间',
    prop: 'announcementDate',
    el: 'ElDatePicker',
    elAttrs: {
      type: 'datetime',
      placeholder: '选择日期',
    },
  },
  {
    label: '申报截止时间',
    prop: 'declareEndDate',
    el: 'ElDatePicker',
    elAttrs: {
      type: 'date',
      placeholder: '选择日期',
    },
  },
  {
    label: '公告内容',
    prop: 'announcementContent',
    el: 'WangEditor',
    cols: 24,
    elAttrs: {
      placeholder: '选择日期',
      toolbarConfig,
      style: 'border: 1px solid #dcdfe6;width: 100%;',
    },
  },
]
</script>
