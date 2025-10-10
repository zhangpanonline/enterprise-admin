<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" title="审查确认" top="10vh" width="800px">
    <div class="wrap">
      <el-form ref="formRef" label-position="top" :model="form" :rules="rules" size="mini">
        <el-row :gutter="24">
          <!-- 单位、个人 -->
          <template v-if="['f2ec849da47d407ebb4201db8a59039e', 'd041727271c04dacb0a30e1b2249a662'].includes(info.creditorType)">
            <el-col :span="24">
              <el-divider content-position="left">审核金额</el-divider>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmPrincipal">
                <template #label>
                  <span>
                    认定本金<small>（申报金额：<b>{{ formatCNY(info.principal) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmPrincipal" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmInterest">
                <template #label>
                  <span>
                    认定利息<small>（申报金额：<b>{{ formatCNY(info.interest) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmInterest" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmPenalty">
                <template #label>
                  <span>
                    认定违约金<small>（申报金额：<b>{{ formatCNY(info.penalty) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmPenalty" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmLateFees">
                <template #label>
                  <span>
                    认定滞纳金<small>（申报金额：<b>{{ formatCNY(info.lateFees) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmLateFees" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmCompensation">
                <template #label>
                  <span>
                    认定损害赔偿金<small>（申报金额：<b>{{ formatCNY(info.compensation) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmCompensation" />
              </el-form-item>
            </el-col>
          </template>
          <!-- 职工 -->
          <template v-else>
            <el-col :span="12">
              <el-form-item prop="confirmWorkerSalary">
                <template #label>
                  <span>
                    认定职工工资<small>（申报金额：<b>{{ formatCNY(info.workerSalary) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmWorkerSalary" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmWorkerMedical">
                <template #label>
                  <span>
                    认定医疗/伤残补助/抚恤费<small>（申报金额：<b>{{ formatCNY(info.workerMedical) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmWorkerMedical" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmWorkerPension">
                <template #label>
                  <span>
                    认定基本养老保险/医疗保险费<small>（申报金额：<b>{{ formatCNY(info.workerPension) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmWorkerPension" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmWorkerCompensation">
                <template #label>
                  <span>
                    认定职工补偿金<small>（申报金额：<b>{{ formatCNY(info.workerCompensation) }}</b>）</small>
                  </span>
                </template>
                <FormatCNY v-model="form.confirmWorkerCompensation" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item prop="confirmOther">
              <template #label>
                <span>
                  认定其他金额<small>（申报金额：<b>{{ formatCNY(info.other) }}</b>）</small>
                </span>
              </template>
              <FormatCNY v-model="form.confirmOther" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认金额" prop="confirmTotal">
              <FormatCNY v-model="form.confirmTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="暂缓金额" prop="respiteTotal">
              <FormatCNY v-model="form.respiteTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不予确认金额" prop="noConfirmTotal">
              <FormatCNY v-model="form.noConfirmTotal" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">债权性质</el-divider>
          </el-col>
          <el-col v-for="(v, i) in form.nature" :key="i" :span="24">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :prop="'nature[' + i + '][confirmTotal]'" :rules="[{ required: true, message: '请输入确认金额', trigger: 'blur'}]" label="确认金额">
                  <FormatCNY v-model="form.nature[i]['confirmTotal']" placeholder="请输入确认金额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :prop="'nature[' + i + '][natureOne]'" :rules="[{ required: true, message: '请选择性质', trigger: 'change'}]" label="性质">
                  <el-select v-model="form.nature[i]['natureOne']">
                    <el-option v-for="v in dict.natureOne" :key="v.value" :value="v.value" :label="v.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p class="divider">
                  <span v-if="form.nature.length > 1" class="delete" @click="onDeleteClaim(i)">
                    <el-icon><IconEpDelete /></el-icon>
                  </span>
                </p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <p class="add" @click="onAddClaim()">
              <el-icon><IconEpPlus /></el-icon>
              添加债权性质
            </p>
          </el-col>
          <el-col :span="24">
            <el-form-item class="mt-5" label="债权审查意见" prop="comment">
              <el-input :autosize="{ minRows: 4 }" v-model="form.comment" type="textarea" placeholder="请输入" maxlength="5000" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-checkbox v-model="form.commentFlag">
        审查意见同步到债权人
        <el-popover
          placement="top-start"
          trigger="hover"
          content="审查意见同步后，债权人登录系统即可查看债权审查信息">
          <template #reference>
            <el-icon>
              <IconEpWarning />
            </el-icon>
          </template>
        </el-popover>
      </el-checkbox>
      <span @click="close">取消</span>
      <el-button v-loading="loading" type="primary" size="mini" @click="onSave()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { NATURE_CLAIM } from '@/constant'
const rules = {
  confirmPrincipal: [{ required: true, message: '请输入认定本金', trigger: 'blur' }],
  confirmInterest: [{ required: true, message: '请输入认定利息', trigger: 'blur' }],
  confirmPenalty: [{ required: true, message: '请输入认定违约金', trigger: 'blur' }],
  confirmLateFees: [{ required: true, message: '请输入认定滞纳金', trigger: 'blur' }],
  confirmCompensation: [{ required: true, message: '请输入认定损害赔偿金', trigger: 'blur' }],
  confirmOther: [{ required: true, message: '请输入认定其他金额', trigger: 'blur' }],
  confirmWorkerSalary: [{ required: true, message: '请输入认定职工工资', trigger: 'blur' }],
  confirmWorkerMedical: [{ required: true, message: '请输入认定医疗/伤残补助/抚恤费', trigger: 'blur' }],
  confirmWorkerPension: [{ required: true, message: '请输入认定基本养老保险/医疗保险费', trigger: 'blur' }],
  confirmWorkerCompensation: [{ required: true, message: '请输入认定职工补偿金', trigger: 'blur' }],
  confirmTotal: [{ required: true, message: '请输入确认金额', trigger: 'blur' }],
  comment: [{ required: true, message: '请输入债权审查意见', trigger: 'blur' }],
}
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    caseInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      form: {
        confirmPrincipal: 0,
        confirmInterest: 0,
        confirmPenalty: 0,
        confirmLateFees: 0,
        confirmCompensation: 0,
        confirmOther: 0,
        confirmTotal: 0,
        respiteTotal: 0,
        noConfirmTotal: 0,
        comment: '',
        commentFlag: false,
        confirmWorkerSalary: 0,
        confirmWorkerMedical: 0,
        confirmWorkerPension: 0,
        confirmWorkerCompensation: 0,
        nature: [{ natureOne: '', confirmTotal: 0 }],
      },
      rules,
      dict: {
        natureOne: NATURE_CLAIM,
      },
      loading: false,
    }
  },
  computed: {
    // 自动计算确认总额
    total() {
      const {
        // 单位、个人认定金额
        confirmPrincipal,
        confirmInterest,
        confirmPenalty,
        confirmLateFees,
        confirmCompensation,
        confirmOther,
        // 职工认定金额
        confirmWorkerSalary,
        confirmWorkerMedical,
        confirmWorkerPension,
        confirmWorkerCompensation,
      } = this.form
      const scaled = 10000
      if (['f2ec849da47d407ebb4201db8a59039e', 'd041727271c04dacb0a30e1b2249a662'].includes(this.info.creditorType)) {
        return (confirmPrincipal * scaled + confirmInterest * scaled + confirmPenalty * scaled + confirmLateFees * scaled + confirmCompensation * scaled + confirmOther * scaled) / scaled
      } else {
        return (confirmWorkerSalary * scaled + confirmWorkerMedical * scaled + confirmWorkerPension * scaled + confirmWorkerCompensation * scaled) / scaled
      }
    },
  },
  watch: {
    info: {
      deep: true,
      handler(o) {
        Object.keys(this.form).forEach(key => {
          if (o[key]) {
            if (key === 'nature' && o[key].length === 0) {
              this.form['nature'] = [{ natureOne: '', confirmTotal: 0 }]
            } else {
              this.form[key] = o[key]
            }
          }
        })
      },
    },
    total(num) {
      this.form.confirmTotal = num
    },
  },
  methods: {
    formatCNY(num) {
      if ([null, undefined, ''].includes(num)) num = 0
      const type = typeof num
      const options = { currency: 'CNY', style: 'currency' }
      if (type === 'string') {
        return Number.parseFloat(num).toLocaleString('zh-CN', options)
      } else if (type === 'number') {
        return num.toLocaleString('zh-CN', options)
      } else {
        return num
      }
    },
    close() {
      this.visible = false
    },
    onAddClaim() {
      const idx = this.form.nature.length
      this.form.nature[idx] = { confirmTotal: '', natureOne: '' }
    },
    onDeleteClaim(i) {
      this.form.nature.splice(i, 1)
    },
    async onSave() {
      if (this.loading) return false
      try {
        this.loading = true
        const validate = await this.$refs.formRef.validate()
        if (!validate) return ElMessage.warning('请完善审查确认信息！')
        const { moneyDetailId, creditorId, creditorType, total } = this.info
        var natureTotal = 0
        if (this.form.nature.length > 0) {
          this.form.nature.forEach(v => {
            v.moneyDetailId = moneyDetailId
            natureTotal += Number(v.confirmTotal)
          })
        }
        // 校验 确认金额+暂缓金额+不予确认金额≤申报金额
        // 确认金额
        const confirmTotal = Number(this.form.confirmTotal)
        // 暂缓金额
        const respiteTotal = Number(this.form.respiteTotal)
        // 不予确认金额
        const noConfirmTotal = Number(this.form.noConfirmTotal)
        if (confirmTotal + respiteTotal + noConfirmTotal > total) {
          ElMessageBox.alert('确认金额、暂缓金额、不予确认金额之和应当小于等于申报金额！', '请确认审核金额，审核金额不能大于申报金额', {
            confirmButtonText: '确定',
            type: 'error',
          })
          return false
        }
        if (natureTotal > this.total) {
          ElMessageBox.alert('债权性质确认金额之和应当小于等于总确认金额！', '请确认债权性质，确认金额不能大于总确认金额', {
            confirmButtonText: '确定',
            type: 'error',
          })
          return false
        }
        const res = await editMoneyDetailApi({
          ...this.form,
          respiteTotal: Number(this.form.respiteTotal),
          noConfirmTotal: Number(this.form.noConfirmTotal),
          commentFlag: this.form.commentFlag ? 1 : 0,
          id: moneyDetailId,
          creditorId,
          declaredTotal: total,
          creditorType,
          projectId: this.caseInfo.projectId,
        })
        if (res.success) {
          ElMessage.success('操作成功！')
          this.close()
          // 如果 moneyDetailId 没有值，说明是新增，需要将返回的新 moneyDetailId 放到缓存里
          this.$emit('ok', moneyDetailId ? '' : res.data)
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        const keys = Object.keys(error)
        const msg = keys.length ? ElMessage.error(error[keys[0]][0]['message']) : error.message
        ElMessage.error(msg)
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 12px 20px;
}
.el-select, .el-select--mini {
  width: 100%;
}
.wrap small {
  color: #999;
}
.wrap .add {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: 1px dashed #a69480;
  border-radius: 2px;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
}
.wrap .divider {
  border-bottom: 1px dashed #dcdfe6;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
}
.wrap .divider .delete {
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
.wrap .divider .delete:hover {
  border-color: red;
}
.footer {
  display: grid;
  grid-template-columns: 1fr  60px 100px;
  align-items: center;
  padding: 20px 0;
}
.footer span {
  cursor: pointer;
}
</style>
