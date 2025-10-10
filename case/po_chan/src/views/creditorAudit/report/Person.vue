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
          <el-form-item label="债权人开户行" prop="creditorOpeningBank">
            <el-input
              v-model="form.creditorOpeningBank"
              placeholder="请输入债权人开户行"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权人户名" prop="creditorAccountName">
            <el-input
              v-model="form.creditorAccountName"
              placeholder="请输入债权人本人账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权人本人账号" prop="creditorAccount">
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
            label="申报本金"
            prop="bankruptCreditorMoneyDetailList[0]['principal']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['principal']"
              placeholder="请输入申报本金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="申报利息"
            prop="bankruptCreditorMoneyDetailList[0]['interest']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['interest']"
              placeholder="请输入申报利息"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="申报违约金"
            prop="bankruptCreditorMoneyDetailList[0]['penalty']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['penalty']"
              placeholder="请输入申报违约金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="申报滞纳金"
            prop="bankruptCreditorMoneyDetailList[0]['lateFees']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['lateFees']"
              placeholder="请输入申报滞纳金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="申报损害赔偿金"
            prop="bankruptCreditorMoneyDetailList[0]['compensation']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['compensation']"
              placeholder="请输入申报损害赔偿金"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item
            label="其他（诉讼费、仲裁费、鉴定费等）"
            prop="bankruptCreditorMoneyDetailList[0]['other']"
          >
            <FormatCNY
              v-model="form.bankruptCreditorMoneyDetailList[0]['other']"
              placeholder="请输入"
            >
            <template #suffix>
              <el-icon title="诉讼费、仲裁费、鉴定费等">
                <IconEpInfoFilled />
              </el-icon>
            </template>
            </FormatCNY>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="申报债权性质" prop="bankruptCreditorMoneyDetailList[0]['natureOne']">
            <el-select v-model="form.bankruptCreditorMoneyDetailList[0]['natureOne']">
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
            prop="bankruptCreditorAgent[0]['agentType']"
          >
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
      <!-- 连带债权 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">连带债权</div>
        </el-col>
        <el-col
          v-for="(v, i) in form.bankruptCreditorJointCredit"
          :key="i"
          :span="24"
        >
          <el-row :gutter="24">
            <el-col :span="colSpan">
              <el-form-item
                :prop="'bankruptCreditorJointCredit[' + i + '][total]'"
                label="连带债权数额（元）"
              >
                <FormatCNY
                  v-model="form.bankruptCreditorJointCredit[i]['total']"
                  placeholder="请输入连带债权数额"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                :prop="'bankruptCreditorJointCredit[' + i + '][creditorDate]'"
                label="债权发生时间"
              >
                <el-date-picker
                  v-model="form.bankruptCreditorJointCredit[i]['creditorDate']"
                  type="date"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                :prop="
                  'bankruptCreditorJointCredit[' + i + '][jointCreditUser]'
                "
                label="连带债权人"
              >
                <el-input
                  v-model="
                    form.bankruptCreditorJointCredit[i]['jointCreditUser']
                  "
                  placeholder="请输入连带债权人"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <p class="divider">
                <span v-if="isEdit" class="delete" @click="onDeleteClaim(i)">
                  <el-icon><IconEpDelete /></el-icon>
                </span>
              </p>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="isEdit" :span="24">
          <p class="add" @click="onAddClaim()">
            <el-icon><IconEpPlus /></el-icon>
            添加连带债权
          </p>
        </el-col>
      </el-row>
      <!-- 其他信息 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="title">其他信息</div>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权发生时间" prop="creditorCreateDate">
            <el-date-picker
              v-model="form.creditorCreateDate"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="债权是否到期" prop="creditorIsExpire">
            <el-select
              v-model="form.creditorIsExpire"
              placeholder="请选择债权是否到期"
            >
              <el-option :value="0" label="未到期"></el-option>
              <el-option :value="1" label="已到期"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.creditorIsExpire === 1" :span="colSpan">
          <el-form-item label="债权到期截止时间" prop="creditorExpireDate">
            <el-date-picker
              v-model="form.creditorExpireDate"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="最后一次要求清偿的时间" prop="lastRequestDate">
            <el-date-picker
              v-model="form.lastRequestDate"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="有无担保" prop="isGuarantee">
            <el-select v-model="form.isGuarantee" placeholder="请选择有无担保">
              <el-option :value="1" label="有担保"></el-option>
              <el-option :value="0" label="无担保"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="form.isGuarantee == 1">
          <el-col :span="colSpan">
            <el-form-item label="担保人名称" prop="guaranteeName">
              <el-input
                v-model="form.guaranteeName"
                placeholder="请输入担保人名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="担保金额" prop="guaranteeMoney">
              <FormatCNY
                v-model="form.guaranteeMoney"
                placeholder="请输入担保金额"
              />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="担保形式" prop="guaranteeType">
              <el-select
                v-model="form.guaranteeType"
                placeholder="请选择担保形式"
              >
                <el-option
                  v-for="v in dict.guaranteeType"
                  :key="v.value"
                  :label="v.label"
                  :value="v.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item label="保证形式" prop="ensureType">
              <el-select v-model="form.ensureType" placeholder="请选择保证形式">
                <el-option :value="1" label="一般保证"></el-option>
                <el-option :value="2" label="连带保证"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="colSpan">
          <el-form-item label="是否保证债权" prop="isGuaranteeCreditor">
            <el-select
              v-model="form.isGuaranteeCreditor"
              placeholder="请选择是否保证债权"
            >
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
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
import { CASE_EDIT_AUDIT_UPDATE, CASE_EDIT_AUDIT, COUNTRY, NATURE_CLAIM } from '@/constant'
export default {
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { telphoneValid, creditCodeValid, bankValid, idCardValid } = useValidate()
    const rules = {
      creditorName: [
        { required: true, message: '请输入债权申报人名称！', trigger: 'blur' },
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
      socialCreditCode: [
        { required: true, message: '请输入企业信用代码！', trigger: 'blur' },
        { validator: creditCodeValid, trigger: 'blur' },
      ],
      creditorPhone: [
        { required: true, message: '请输入债权人电话！', trigger: 'blur' },
        { validator: telphoneValid, trigger: 'blur' },
      ],
      creditorDate: [
        { required: true, message: '请输入申报时间！', trigger: 'change' },
      ],
      creditorCreateDate: [
        { required: true, message: '请输入债权发生时间！', trigger: 'change' },
      ],
      isGuarantee: [
        { required: true, message: '请选择有无担保！', trigger: 'change' },
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
    return { rules, idCardValid }
  },
  data() {
    return {
      COUNTRY,
      NATURE_CLAIM,

      colSpan: 8,
      dict: {
        legalInstrument: [], // 法律文书
        guaranteeType: [], // 担保形式
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
          principal,
          interest,
          penalty,
          lateFees,
          compensation,
          other,
        } = this.form.bankruptCreditorMoneyDetailList[0]
        const scaled = 10000
        return (
          (principal * scaled +
            interest * scaled +
            penalty * scaled +
            lateFees * scaled +
            compensation * scaled +
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
        const res = await Promise.all([
          getDictApi({ code: 'bankruptGuarantee' }),
          getDictApi({ code: 'bankrupInstrument' }),
        ])
        if (res[0].success) {
          this.dict.guaranteeType = res[0].data.map(v => ({
            label: v.dictLabel,
            value: v.id,
          }))
        }
        if (res[1].success) {
          this.dict.legalInstrument = res[1].data.map(v => ({
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
            if (!this.form.bankruptCreditorMoneyDetailList[0]['principal']) {
              this.form.bankruptCreditorMoneyDetailList[0]['principal'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['interest']) {
              this.form.bankruptCreditorMoneyDetailList[0]['interest'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['penalty']) {
              this.form.bankruptCreditorMoneyDetailList[0]['penalty'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['lateFees']) {
              this.form.bankruptCreditorMoneyDetailList[0]['lateFees'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['compensation']) {
              this.form.bankruptCreditorMoneyDetailList[0]['compensation'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['other']) {
              this.form.bankruptCreditorMoneyDetailList[0]['other'] = 0
            }
            if (!this.form.bankruptCreditorMoneyDetailList[0]['natureOne']) {
              this.form.bankruptCreditorMoneyDetailList[0]['natureOne'] = ''
            }
          } else {
            this.form.bankruptCreditorMoneyDetailList[0] = {
              total: 0,
              principal: 0,
              interest: 0,
              penalty: 0,
              lateFees: 0,
              compensation: 0,
              other: 0,
              natureOne: '',
            }
          }
          // 处理代理人信息
          if (this.form.bankruptCreditorAgent[0]) {
            if (!this.form.bankruptCreditorAgent[0]['agentName']) { this.form.bankruptCreditorAgent[0]['agentName'] = '' }
            if (!this.form.bankruptCreditorAgent[0]['agentType']) { this.form.bankruptCreditorAgent[0]['agentType'] = '' }
            if (!this.form.bankruptCreditorAgent[0]['agentIdcard']) { this.form.bankruptCreditorAgent[0]['agentIdcard'] = '' }
            if (!this.form.bankruptCreditorAgent[0]['agentPhone']) { this.form.bankruptCreditorAgent[0]['agentPhone'] = '' }
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
    // 添加连带债权
    onAddClaim() {
      const idx = this.form.bankruptCreditorJointCredit.length
      this.form.bankruptCreditorJointCredit[idx] = {
        total: 0,
        creditorDate: '',
        jointCreditUser: '',
      }
    },
    // 移除某一项连带债权
    onDeleteClaim(i) {
      this.form.bankruptCreditorJointCredit.splice(i, 1)
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
        // 有无担保
        if (this.form.isGuarantee === 0) {
          this.form.guaranteeName = ''
          this.form.guaranteeMoney = ''
          this.form.guaranteeType = ''
          this.form.ensureType = ''
        }
        // 是否有生效法律文书
        if (this.form.isHasLegalInstrument === 0) {
          this.form.legalInstrument = ''
          this.form.isApplyExecute = ''
        }
        // 债权是否到期
        if (this.form.creditorIsExpire === 0) {
          this.form.creditorExpireDate = ''
        }
        // 连带债权金额不能为空
        if (this.form.bankruptCreditorJointCredit.length > 0) {
          this.form.bankruptCreditorJointCredit.forEach(v => {
            if (!v.total) v.total = 0
          })
        }
        const res = await updateCreditorAuditApi(this.form)
        if (res.success) {
          window.localStorage.setItem(CASE_EDIT_AUDIT_UPDATE, 'true')
          if (
            Array.isArray(res.data.bankruptCreditorMoneyDetailList) &&
            res.data.bankruptCreditorMoneyDetailList.length > 0
          ) {
            const moneyDetailId =
              res.data.bankruptCreditorMoneyDetailList[0]['id']
            this.$parent.creditor = { ...this.$parent.creditor, moneyDetailId }
            // 新增申报金额时，才会有moneyDetailId，防止用户刷新页面，没有moneyDetailId，所以再存储一次
            window.localStorage.setItem(
              CASE_EDIT_AUDIT,
              JSON.stringify({
                case: this.caseInfo,
                creditor: { ...this.creditor, moneyDetailId },
              })
            )
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
        confirmOther,
        other,
        nature,
        commentFlag,
        comment,
        // 与职工不同，单位和个人才有下面这些字段
        principal,
        interest,
        penalty,
        lateFees,
        compensation,
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
        confirmOther,
        other,
        nature,
        // eslint-disable-next-line eqeqeq
        commentFlag: commentFlag == '1',
        comment,
        // 与职工不同，单位和个人才有下面这些字段
        principal,
        interest,
        penalty,
        lateFees,
        compensation,
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
  background: #a69480;
  border-radius: 2px;
  height: 0.8em;
}
.add {
  width: 80%;
  height: 40px;
  line-height: 40px;
  border: 1px dashed #a69480;
  border-radius: 2px;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
}
.divider {
  border-bottom: 1px dashed #dcdfe6;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
}
.delete {
  position: absolute;
  right: 20px;
  top: -1em;
  color: red;
  width: 2em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  border: 1px dashed #dcdfe6;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}
.delete:hover {
  border-color: red;
}
.footer {
  text-align: center;
}
</style>
