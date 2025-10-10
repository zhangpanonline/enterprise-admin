<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" title="新增债权" width="50%" top="15vh">
    <el-form ref="formRef" :model="form" :rules="rules" size="mini">
      <el-row :gutter="20">
        <el-col :span="colSpan">
          <el-form-item label="债权人名称" prop="creditorName">
            <el-input v-model="form.creditorName" placeholder="请输入债权人名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权人手机号" prop="creditorPhone">
            <el-input v-model="form.creditorPhone" placeholder="请输入债权人手机号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权人类型" prop="creditorType">
            <el-select v-model="form.creditorType" placeholder="请选择债权人类型">
              <el-option v-for="v in dictCreditorType" :key="v.value" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="代理人身份" prop="agentType">
            <el-select v-model="form.agentType" placeholder="请选择代理人身份" clearable>
              <el-option v-for="v in dict.agentType" :key="v.value" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="代理人名称" prop="agentName" :rules="[{ required: form.agentType, message: '请输入代理人名称！' }]">
            <el-input v-model="form.agentName" placeholder="请输入代理人名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="代理人手机号" prop="agentPhone" :rules="[{ required: form.agentType, message: '请输入代理人手机号！' }]">
            <el-input v-model="form.agentPhone" placeholder="请输入代理人手机号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="代理人身份号" prop="agentIdcard" :rules="[{ required: form.agentType, message: '请输入代理人身份号！' }]">
            <el-input v-model="form.agentIdcard" placeholder="请输入代理人身份号" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button v-loading="loading" size="mini" type="primary" @click="onSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dictCreditorType: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const { phoneValid, telphoneValid, idCardValid } = useValidate()
    const rules = {
      creditorName: [{ required: true, message: '请输入债权人名称', trigger: 'blur' }],
      creditorPhone: [
        { required: true, message: '请输入债权人手机号', trigger: 'blur' },
        { validator: phoneValid, trigger: 'blur' },
      ],
      creditorType: [{ required: true, message: '请选择债权人类型', trigger: 'blur' }],
      agentPhone: [{ validator: telphoneValid, trigger: 'blur' }],
      agentIdcard: [{ validator: idCardValid, trigger: 'blur' }],
    }
    return { rules }
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        creditorName: '',
        creditorType: '',
        agentName: '',
        agentType: '',
        agentPhone: '',
        agentIdcard: '',
        creditorPhone: '',
      },
      dict: {
        agentType: [
          { label: '自然人', value: '自然人' },
          { label: '律师', value: '律师' },
        ],
      },
      colSpan: 12,
      projectId: '',
    }
  },
  methods: {
    close() {
      this.$refs.formRef.resetFields()
      this.visible = false
    },
    async onSubmit() {
      try {
        this.loading = true
        const res = await this.$refs.formRef.validate()
        if (!res) return false
        const { agentName, agentType, agentPhone, agentIdcard, ...params } = this.form
        params.bankruptCreditorAgent = [{ agentName, agentType, agentPhone, agentIdcard }]
        params.projectId = this.projectId
        if (import.meta.env.DEV) {
          params.createUser = useAppStore().userInfo.userId
        }
        const result = await saveCreditorPCApi(params)
        if (result.success) {
          ElMessage.success('操作成功！')
          this.close()
          this.$emit('ok')
        } else {
          console.error(result)
          ElMessage.error(result.msg)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-select) {
  width: 100%;
}
.footer {
  width: 50%;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
}
</style>
