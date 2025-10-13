<template>
  <div class="report">
    <el-form
      ref="formRef"
      :rules="rules"
      :disabled="!isEdit"
      :model="form"
      size="mini"
    >
      <!-- 基本信息 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">基本信息</div>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权申报人名称" prop="creditorName">
            <el-input
              :disabled="[7, 2, 9].includes(Number(creditor.status))"
              v-model="form.creditorName"
              placeholder="请输入债权申报人名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权人电话" prop="creditorPhone">
            <el-input
              :disabled="[7, 2, 9].includes(Number(creditor.status))"
              v-model="form.creditorPhone"
              placeholder="请输入债权人电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            :rules="idCardRules"
            label="债权人身份证号"
            prop="legarIdcard"
          >
            <el-input
              v-model="form.legarIdcard"
              :disabled="!isEdit || !form.idcardArea"
              placeholder="请输入债权人身份证号"
            >
              <template #prepend>
                <el-select
                  v-model="form.idcardArea"
                  style="width: 120px !important;"
                  placeholder="选择国家地区"
                >
                  <el-option
                    v-for="v in COUNTRY"
                    :key="v.value"
                    :value="v.value"
                    :label="v.label"
                  ></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="申报时间" prop="creditorDate">
            <el-date-picker
              v-model="form.creditorDate"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="开户行" prop="creditorOpeningBank">
            <el-input
              v-model="form.creditorOpeningBank"
              placeholder="请输入债权人开户行"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="户名" prop="creditorAccountName">
            <el-input
              v-model="form.creditorAccountName"
              placeholder="请输入债权人本人账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="本人账号" prop="creditorAccount">
            <el-input
              v-model="form.creditorAccount"
              placeholder="请输入债权人本人账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入联系地址" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="邮编" prop="postcode">
            <el-input v-model="form.postcode" placeholder="请输入邮编" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="微信号" prop="weChat">
            <el-input v-model="form.weChat" placeholder="请输入微信号" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 申报金额 -->
      <el-row
        v-if="
          form.bankruptCreditorMoneyDetailList &&
            form.bankruptCreditorMoneyDetailList[0]
        "
        :gutter="20"
      >
        <el-col :span="24">
          <div class="title">申报金额</div>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="申报金额总额"
            prop="bankruptCreditorMoneyDetailList[0]['total']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['total']"
              disabled
              placeholder="请输入单笔申报总额"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="职工薪资"
            prop="bankruptCreditorMoneyDetailList[0]['workerSalary']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['workerSalary']"
              placeholder="请输入职工薪资"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="医疗/伤残补助/抚恤费用"
            prop="bankruptCreditorMoneyDetailList[0]['workerMedical']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['workerMedical']"
              placeholder="请输入医疗 / 伤残补助 / 抚恤费用"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="基本养老保险费/医疗保险费"
            prop="bankruptCreditorMoneyDetailList[0]['workerPension']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['workerPension']"
              placeholder="请输入基本养老保险费 / 医疗保险费"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="职工补偿金"
            prop="bankruptCreditorMoneyDetailList[0]['workerCompensation']"
          >
            <FormatCNY
              v-model="
                form.bankruptCreditorMoneyDetailList[0]['workerCompensation']
              "
              placeholder="请输入职工补偿金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="其他（诉讼费、仲裁费、鉴定费等）"
            prop="bankruptCreditorMoneyDetailList[0]['other']"
          >
            <FormatCNY v-model="form.bankruptCreditorMoneyDetailList[0]['other']" placeholder="请输入">
              <template #suffix>
                <el-icon title="诉讼费、仲裁费、鉴定费等">
                  <IconEpInfoFilled />
                </el-icon>
              </template>
            </FormatCNY>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="申报债权性质" prop="natureOne">
            <el-select v-model="form.natureOne">
              <el-option
                v-for="v in NATURE_CLAIM"
                :key="v.value"
                :value="v.value"
                :label="v.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 代理人信息 -->
      <el-row
        v-if="form.bankruptCreditorAgent && form.bankruptCreditorAgent[0]"
        :gutter="20"
      >
        <el-col :span="24">
          <div class="title">代理人信息</div>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="代理人身份"
            prop="bankruptCreditorAgent[0]['agentType']">
            <el-select
              v-model="form.bankruptCreditorAgent[0]['agentType']"
              clearable
              placeholder="请选择代理人身份"
            >
              <el-option value="律师" label="律师"></el-option>
              <el-option value="自然人" label="自然人"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="代理人名称"
            prop="bankruptCreditorAgent[0]['agentName']"
            :rules="[{ required: !!form.bankruptCreditorAgent[0]['agentType'], message: '请输入代理人名称！' }]"
          >
            <el-input
              v-model="form.bankruptCreditorAgent[0]['agentName']"
              placeholder="请输入代理人名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="代理人身份证号"
            prop="bankruptCreditorAgent[0]['agentIdcard']"
            :rules="[{ required: !!form.bankruptCreditorAgent[0]['agentType'], message: '请输入代理人身份证号！' }, { validator: idCardValid }]"
          >
            <el-input
              v-model="form.bankruptCreditorAgent[0]['agentIdcard']"
              placeholder="请输入代理人身份证号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="代理人电话"
            prop="bankruptCreditorAgent[0]['agentPhone']"
            :rules="[{ required: !!form.bankruptCreditorAgent[0]['agentType'], message: '请输入代理人电话！' }]"
          >
            <el-input
              v-model="form.bankruptCreditorAgent[0]['agentPhone']"
              placeholder="请输入代理人电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 其他信息 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">其他信息</div>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="是否正在进行诉讼、仲裁" prop="isLawsuiting">
            <el-select
              v-model="form.isLawsuiting"
              placeholder="请选择是否正在进行诉讼、仲裁"
            >
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="是否有生效法律文书" prop="isHasLegalInstrument">
            <el-select
              v-model="form.isHasLegalInstrument"
              placeholder="请选择是否有生效法律文书"
            >
              <el-option :value="1" label="有"></el-option>
              <el-option :value="0" label="无"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="form.isHasLegalInstrument">
          <el-col :span="colSpan">
            <el-form-item label="是否申请执行" prop="isApplyExecute">
              <el-select
                v-model="form.isApplyExecute"
                placeholder="请选择是否申请执行"
              >
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="请选择法律文书">
              <el-select
                v-model="form.legalInstrument"
                placeholder="请选择法律文书"
              >
                <el-option
                  v-for="v in dict.legalInstrument"
                  :key="v.value"
                  :label="v.label"
                  :value="v.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">债权发生的基本事实和理由</div>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="factAndReason">
            <el-input
              v-model="form.factAndReason"
              :autosize="{ minRows: 8 }"
              type="textarea"
              placeholder="请输入"
              maxlength="30000"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="isEdit" class="footer">
      <el-button type="default" @click="onCancel()">取消</el-button>
      <el-button
        v-loading="loading"
        type="primary"
        @click="onSave()"
      >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { COUNTRY, NATURE_CLAIM, CASE_EDIT_AUDIT_UPDATE } from '@/constant'
export default {
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { phoneValid, bankValid } = useValidate()
    const rules = {
      creditorName: [
        { required: true, message: '请输入债权申报人名称', trigger: 'blur' },
      ],
      creditorPhone: [
        { required: true, message: '请输入债权人电话', trigger: 'blur' },
        { validator: phoneValid, trigger: 'blur' },
      ],
      creditorDate: [
        { required: true, message: '请输入申报时间', trigger: 'change' },
      ],
      creditorAccountName: [
        { required: true, message: '请输入债权人户名！', trigger: 'blur' },
      ],
      creditorAccount: [
        { required: true, message: '请输入债权人本人账号！', trigger: 'blur' },
        { validator: bankValid, trigger: 'blur' },
      ],
      address: [
        { required: true, message: '请输入联系地址！', trigger: 'blur' },
      ],
      creditorOpeningBank: [
        { required: true, message: '请输入债权人开户行！', trigger: 'blur' },
      ],
      isLawsuiting: [
        { required: true, message: '请选择是否正在进行诉讼、仲裁！', trigger: 'change' },
      ],
      isHasLegalInstrument: [
        { required: true, message: '请选择是否有生效法律文书！', trigger: 'change' },
      ],
      factAndReason: [
        { required: true, message: '请输入债权发生的基本事实和理由！', trigger: 'change' },
      ],
    }
    return { rules }
  },
  data() {
    return {
      NATURE_CLAIM,
      COUNTRY,
      colSpan: 8,
      dict: {
        legalInstrument: [], // 法律文书
      },
      form: {},
      loading: false,
      cacheForm: '',
    }
  },
  computed: {
    // 案件信息
    caseInfo() {
      return this.$parent.caseInfo
    },
    // 债权人信息
    creditor() {
      return this.$parent.creditor
    },
    // 自动计算申报总额
    total() {
      if (
        this.form.bankruptCreditorMoneyDetailList &&
        this.form.bankruptCreditorMoneyDetailList[0]
      ) {
        const {
          workerSalary,
          workerMedical,
          workerPension,
          workerCompensation,
          other,
        } = this.form.bankruptCreditorMoneyDetailList[0]
        const scaled = 10000
        return (
          (workerSalary * scaled +
            workerMedical * scaled +
            workerPension * scaled +
            workerCompensation * scaled +
            other * scaled) /
          scaled
        )
      } else {
        return 0
      }
    },
    // 根据选择的国家地区,动态校验身份证号
    idCardRules() {
      var reg = /.*/
      if (Number(this.form.idcardArea) === 1) {
        // 中国
        reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[Xx\d]$/
      } else if (Number(this.form.idcardArea) === 2) {
        // 中国香港
        reg = /^[A-Z]{1,2}\d{6}([0-9Aa])$/
      } else if (Number(this.form.idcardArea) === 3) {
        // 中国澳门
        reg = /^([1|5|7])\d{6}([(0-9)|(Aa)])$/
      } else if (Number(this.form.idcardArea) === 4) {
        // 中国台湾
        reg = /^[a-zA-Z][1-2]\d{8}$/
      } else {
        // 其他
        reg = /.{1,18}/
      }
      return [
        {
          trigger: 'blur',
          validator: (rule, val, cb) => {
            reg.test(val) ? cb() : cb('身份证格式不正确!')
          },
        },
        {
          trigger: 'blur',
          required: true,
          message: '请输入身份证号!',
        },
      ]
    },
  },
  watch: {
    // 自动计算的申报总额变化，修改 form 表单数据
    total(num) {
      if (
        this.form.bankruptCreditorMoneyDetailList &&
        this.form.bankruptCreditorMoneyDetailList[0]
      ) {
        this.form.bankruptCreditorMoneyDetailList[0]['total'] = num
      }
    },
  },
  created() {
    this.getDetail()
    this.getDict()
  },
  methods: {
    async getDict() {
      try {
        const res = await getDictApi({ code: 'bankrupInstrument' })
        if (res.success) {
          this.dict.legalInstrument = res.data.map(v => ({
            label: v.dictLabel,
            value: v.id,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getDetail() {
      try {
        const res = await creaditorAuditFindOneApi({
          creditorId: this.creditor.creditorId,
          moneyDetailId: this.creditor.moneyDetailId,
          canReviewer: this.creditor.canReviewer,
        })
        if (res.success) {
          this.cacheForm = JSON.stringify(res.data)
          this.form = res.data
          this.form.idcardArea = this.form.idcardArea || 1
          // 处理申报金额
          if (this.form.bankruptCreditorMoneyDetailList[0]) {
            if (!this.form.bankruptCreditorMoneyDetailList[0]['total']) {
              this.form.bankruptCreditorMoneyDetailList[0]['total'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['workerSalary']) {
              this.form.bankruptCreditorMoneyDetailList[0]['workerSalary'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['workerMedical']) {
              this.form.bankruptCreditorMoneyDetailList[0]['workerMedical'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['workerPension']) {
              this.form.bankruptCreditorMoneyDetailList[0]['workerPension'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['workerCompensation']) {
              this.form.bankruptCreditorMoneyDetailList[0]['workerCompensation'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['other']) {
              this.form.bankruptCreditorMoneyDetailList[0]['other'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['natureOne']) {
              this.form.bankruptCreditorMoneyDetailList[0]['natureOne'] = 0
            }
          } else {
            this.form.bankruptCreditorMoneyDetailList[0] = {
              total: 0,
              workerSalary: 0,
              workerMedical: 0,
              workerPension: 0,
              workerCompensation: 0,
              other: 0,
              natureOne: '',
            }
          }
          // 处理代理人信息
          if (this.form.bankruptCreditorAgent[0]) {
            if (!this.form.bankruptCreditorAgent[0]['agentName']) {
              this.form.bankruptCreditorAgent[0]['agentName'] = ''
            }
            if (!this.form.bankruptCreditorAgent[0]['agentType']) {
              this.form.bankruptCreditorAgent[0]['agentType'] = ''
            }
            if (!this.form.bankruptCreditorAgent[0]['agentIdcard']) {
              this.form.bankruptCreditorAgent[0]['agentIdcard'] = ''
            }
            if (!this.form.bankruptCreditorAgent[0]['agentPhone']) {
              this.form.bankruptCreditorAgent[0]['agentPhone'] = ''
            }
          } else {
            this.form.bankruptCreditorAgent[0] = {
              agentName: '',
              agentType: '',
              agentIdcard: '',
              agentPhone: '',
            }
          }
          this.$nextTick(this.$refs.formRef.clearValidate)
          this.getAuditInfo(this.form)
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    onCancel() {
      if (this.loading) return false
      if (this.cacheForm) {
        this.form = JSON.parse(this.cacheForm)
      } else {
        this.getDetail()
      }
      this.$emit('notEdit')
    },
    async onSave() {
      if (this.loading) return false
      try {
        this.loading = true
        const validate = await this.$refs.formRef.validate()
        if (!validate) return false
        // 是否有生效法律文书
        if (this.form.isHasLegalInstrument === 0) {
          this.form.legalInstrument = ''
          this.form.isApplyExecute = ''
        }
        const res = await updateCreditorAuditApi(this.form)
        if (res.success) {
          window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
          if (
            Array.isArray(res.data.bankruptCreditorMoneyDetailList) &&
            res.data.bankruptCreditorMoneyDetailList.length > 0
          ) {
            this.$parent.creditor = {
              ...this.$parent.creditor,
              moneyDetailId:
                res.data.bankruptCreditorMoneyDetailList[0]['id'],
            }
          }
          this.$emit('notEdit')
          this.getDetail()
          ElMessage.success('操作成功！')
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        const keys = Object.keys(error)
        const msg =
          keys.length && Object.prototype.hasOwnProperty.call(this.form, keys[0])
            ? ElMessage.error(error[keys[0]][0]['message'])
            : error.message
        ElMessage.error(msg)
      } finally {
        this.loading = false
      }
    },
    // 筛选出审定需要的字段，传给父级，用于在侧边栏审查认定的回显以及审查确认的回显
    getAuditInfo(form) {
      const { moneyDetailId, creditorId } = this.creditor
      const {
        id,
        creditorType,
        bankruptCreditorMoneyDetailList: [bankruptCreditorMoneyDetailList],
        bankruptCreditorAgent: [bankruptCreditorAgent],
      } = form
      const {
        total,
        confirmTotal,
        respiteTotal,
        noConfirmTotal,
        confirmPrincipal,
        confirmInterest,
        confirmPenalty,
        confirmLateFees,
        confirmCompensation,
        nature,
        commentFlag,
        comment,
        confirmOther,
        other,
        // 与单位和个人不同，职工才有下面这些字段
        workerSalary,
        workerMedical,
        workerPension,
        workerCompensation,
        // 职工认定金额
        confirmWorkerSalary,
        confirmWorkerMedical,
        confirmWorkerPension,
        confirmWorkerCompensation,
      } = bankruptCreditorMoneyDetailList

      const { agentType } = bankruptCreditorAgent
      this.$emit('auditInfo', {
        id,
        creditorType,
        creditorId,
        moneyDetailId,
        total,
        confirmTotal,
        respiteTotal,
        noConfirmTotal,
        confirmPrincipal,
        confirmInterest,
        confirmPenalty,
        confirmLateFees,
        confirmCompensation,
        confirmWorkerSalary,
        confirmWorkerMedical,
        confirmWorkerPension,
        confirmWorkerCompensation,
        confirmOther,
        other,
        nature,
        // eslint-disable-next-line eqeqeq
        commentFlag: commentFlag == '1',
        comment,
        workerSalary,
        workerMedical,
        workerPension,
        workerCompensation,
        // 代理人身份，用来在证据材料处，判断代理人资料类型
        agentType,
      })
    },
  },
}
</script>
<style scoped>
:deep(.el-select,.el-date-editor) {
  width: 100%;
}
.report {
  height: 100%;
  font-size: 14px;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
}
.title {
  color: #999;
  position: relative;
  text-indent: 0.5em;
  padding-bottom: 2em;
}
.title::before {
  position: absolute;
  content: " ";
  top: 0.35em;
  left: 0;
  border: 2px solid #a69480;
  border-radius: 2px;
  height: 0.8em;
}
.footer {
  text-align: center;
}
</style>
