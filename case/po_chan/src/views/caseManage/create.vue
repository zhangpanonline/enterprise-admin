<template>
  <div class="case_create">
    <!-- 头部 -->
    <div class="project_title">
      {{ $route.meta.title }}
      <el-button type="primary" @click="$router.back()"
        >返回</el-button
      >
    </div>
    <!-- 表单内容 -->
    <div class="case_create_body">
      <el-form ref="subFormRef"  label-position="top" :model="subForm" :rules="rules">
        <el-card class="card_box">
          <h3 class="card_title">案件信息</h3>
          <el-row :gutter="20">
            <el-col :span="colSpan">
              <el-form-item label="案件名称" prop="caseName">
                <el-input
                  v-model="subForm.caseName"
                  placeholder="请输入案件名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="受理法院" prop="courtName">
                <el-input
                  v-model="subForm.courtName"
                  placeholder="请输入受理法院"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="案件阶段" prop="caseStage">
                <el-select
                  v-model="subForm.caseStage"
                  placeholder="请选择案件阶段"
                >
                  <el-option
                    v-for="v in dict.bankruptCaseType"
                    :key="v.value"
                    :value="v.value"
                    :label="v.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                label="指定破产管理人决定书"
                prop="managerDecisionFileFileNumber"
                class="file_number">
                <span
                  v-if="inFileList.managerDecisionFile.length"
                  class="file_number_file">
                  <i
                    :title="inFileList.managerDecisionFile[0]['fileName']"
                    class="file_number_file_name">
                    {{ inFileList.managerDecisionFile[0]['fileName'] }}</i>
                  <el-popover placement="top">
                    <template #reference>
                      <el-icon style="width: 100%;height: 100%;" color="red" ><IconEpDelete/></el-icon>
                  </template>
                    <p>确定删除？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        type="primary"
                        @click="
                          inFileList.managerDecisionFile = [];
                          loading.manager = 0;
                          subForm.managerDecisionFileFileNumber = '';
                        "
                        >确定</el-button
                      >
                    </div>
                  </el-popover>
                </span>
                <HuaweiObsUpload
                  v-else
                  ref="uploadRef"
                  :show-file-list="false"
                  :limit="1"
                  :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
                  :in-file-list="inFileList.managerDecisionFile"
                  class="file_number_upload"
                  temp-file="tempFile"
                  system-type="dept"
                  @getPercent="($event) => (loading.manager = Number($event))"
                  @returnFile="
                    ({ filePath, fileName }) => {
                      loading.manager = 0
                      inFileList['managerDecisionFile'] = [
                        { filePath, fileName },
                      ]
                      subForm.managerDecisionFileFileNumber = fileName.includes(
                        '.'
                      )
                        ? fileName.slice(0, fileName.lastIndexOf('.'))
                        : fileName
                    }
                  "
                >
                  <el-progress
                    v-if="loading.manager > 0"
                    :percentage="loading.manager"
                    :format="
                      ($event) => ($event === 100 ? '99%' : `${$event}%`)
                    "
                    color="#67c23a"
                    style="width: 200px"
                  ></el-progress>
                  <span v-else>上传文件</span>
                </HuaweiObsUpload>
                <el-input
                  v-model="subForm.managerDecisionFileFileNumber"
                  placeholder="请输入决定书文号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                label="第一次债权人会议时间"
                prop="firstMeetingDate"
              >
                <el-date-picker
                  v-model="subForm.firstMeetingDate"
                  :picker-options="{ disabledDate: firstMeetingDateDisabled }"
                  type="datetime"
                  placeholder="请选择第一次债权人会议时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="债权申报开始日期" prop="declareStartDate">
                <el-date-picker
                  v-model="subForm.declareStartDate"
                  :picker-options="{ disabledDate: declareStartDateDisabled }"
                  type="date"
                  placeholder="请选择债权申报开始日期"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                label="受理破产清算裁定书"
                prop="liquidationOrderFileFileNumber"
                class="file_number"
              >
                <span
                  v-if="inFileList.liquidationOrderFile.length"
                  class="file_number_file"
                >
                  <i
                    :title="inFileList.liquidationOrderFile[0]['fileName']"
                    class="file_number_file_name"
                    >{{ inFileList.liquidationOrderFile[0]['fileName'] }}</i
                  >
                  <el-popover placement="top">
                    <template #reference>
                      <el-icon style="width: 100%;height: 100%;" color="red" ><IconEpDelete/></el-icon>
                  </template>
                    <p>确定删除？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        type="primary"
                        @click="
                          inFileList.liquidationOrderFile = [];
                          loading.liquidation = 0;
                          subForm.liquidationOrderFileFileNumber = '';
                        "
                        >确定</el-button
                      >
                    </div>
                  </el-popover>
                </span>
                <HuaweiObsUpload
                  v-else
                  ref="uploadRef"
                  :show-file-list="false"
                  :limit="1"
                  :extension="['doc', 'docx', 'pdf', 'xls', 'xlsx']"
                  :in-file-list="inFileList.liquidationOrderFile"
                  class="file_number_upload"
                  temp-file="tempFile"
                  system-type="dept"
                  @getPercent="
                    ($event) => (loading.liquidation = Number($event))
                  "
                  @returnFile="
                    ({ filePath, fileName }) => {
                      loading.liquidation = 0
                      inFileList['liquidationOrderFile'] = [
                        { filePath, fileName },
                      ]
                      subForm.liquidationOrderFileFileNumber =
                        fileName.includes('.')
                          ? fileName.slice(0, fileName.lastIndexOf('.'))
                          : fileName
                    }
                  "
                >
                  <el-progress
                    v-if="loading.liquidation > 0"
                    :percentage="loading.liquidation"
                    :format="
                      ($event) => ($event === 100 ? '99%' : `${$event}%`)
                    "
                    color="#67c23a"
                    style="width: 200px"
                  ></el-progress>
                  <span v-else>上传文件</span>
                </HuaweiObsUpload>
                <el-input
                  v-model="subForm.liquidationOrderFileFileNumber"
                  placeholder="请输入裁定书文号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item
                label="第一次债权会议地址"
                prop="firstMeetingAddress"
              >
                <el-input
                  v-model="subForm.firstMeetingAddress"
                  placeholder="请输入会议地址"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="债权申报截止日期" prop="declareEndDate">
                <el-date-picker
                  v-model="subForm.declareEndDate"
                  :picker-options="{ disabledDate: declareEndDateDisabled }"
                  type="date"
                  placeholder="请选择债权申报截止日期"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="管理人联系方式" prop="custodianPhone">
                <el-input
                  v-model="subForm.custodianPhone"
                  maxlength="50"
                  placeholder="请输入管理人联系方式"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="管理人地址" prop="custodianAddress">
                <el-input
                  v-model="subForm.custodianAddress"
                  placeholder="请输入管理人地址"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="团队邮箱" prop="custodianEmail">
                <el-input
                  v-model="subForm.custodianEmail"
                  maxlength="50"
                  placeholder="请输入团队邮箱"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="破产程序" prop="procedure">
                <el-select
                  v-model="subForm.procedure"
                  placeholder="请选择破产程序"
                >
                  <el-option
                    v-for="v in dict.bankruptProgram"
                    :value="v.value"
                    :label="v.label"
                    :key="v.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公告说明" prop="notice">
                <el-input
                  :autosize="{ minRows: 4 }"
                  v-model="subForm.notice"
                  type="textarea"
                  placeholder="请输入公告说明 . . ."
                  maxlength="5000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申报地点" prop="declareAddress">
                <el-input
                  :autosize="{ minRows: 4 }"
                  v-model="subForm.declareAddress"
                  type="textarea"
                  placeholder="请输入申报地点 . . ."
                  maxlength="5000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="card_box">
          <h3 class="card_title">管理人团队成员</h3>
          <ul class="case_create_manager">
            <li>
              <p class="case_create_manager_title">案件负责人</p>
              <div class="case_create_manager_user">
                <span>
                  <el-avatar
                    v-if="manager.leader.userPhotoPath"
                    :src="manager.leader.userPhotoPath"
                    size="default"
                  />
                  <el-avatar v-else icon="el-icon-user-solid" size="default" />
                  {{ manager.leader.userName }}
                </span>
              </div>
            </li>
            <li>
              <p class="case_create_manager_title">项目主管</p>
              <div class="case_create_manager_user">
                <span v-for="(id, i) in manager.caretaker" :key="id">
                  <el-avatar
                    v-if="manager.cache[id]['avatar']"
                    :src="manager.cache[id]['avatar']"
                    size="default"
                  />
                  <el-avatar v-else icon="el-icon-user-solid" size="default" />
                  {{ manager.cache[id]['name'] }}
                  <el-icon  class="el-icon-close"  title="移除" @click="manager.caretaker.splice(i, 1)" ><IconEpClose/></el-icon>

                </span>
                <span class="case_create_manager_user_add">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    trigger="click"
                    @hide="
                      () => {
                        searchName = ''
                        getManagerUser()
                      }
                    "
                  >
                    <template #reference>
                      <el-icon style="width: 100%;height: 100%;" ><IconEpPlus/></el-icon>
                  </template>
                    <div>
                      <p>
                        <el-input
                          v-model="searchName"
                          placeholder="请输入姓名/电话搜索"
                          clearable
                          @input="getManagerUser(manager.caretaker)"
                        />
                      </p>
                      <el-row class="overflow_y_200">
                        <el-checkbox-group v-model="manager.caretaker">
                          <el-col
                            v-for="v in managerList(manager.user)"
                            :key="v.id"
                            :span="24"
                            class="padding_col_10"
                          >
                            <el-checkbox :label="v.id">
                              {{ v.name }} {{ v.tel }}
                            </el-checkbox>
                          </el-col>
                        </el-checkbox-group>
                      </el-row>
                    </div>
                  </el-popover>
                </span>
              </div>
            </li>
            <li>
              <p class="case_create_manager_title">项目成员</p>
              <div class="case_create_manager_user">
                <span v-for="(id, i) in manager.user" :key="id">
                  <el-avatar
                    v-if="manager.cache[id]['avatar']"
                    :src="manager.cache[id]['avatar']"
                    size="default"
                  />
                  <el-avatar v-else icon="el-icon-user-solid" size="default" />
                  {{ manager.cache[id]['name'] }}
                  <el-icon  class="el-icon-close"  title="移除" @click="manager.user.splice(i, 1)" ><IconEpClose/></el-icon>
                </span>
                <span class="case_create_manager_user_add">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    trigger="click"
                    @hide="
                      () => {
                        searchName = ''
                        getManagerUser()
                      }
                    "
                  >
                  <template #reference>
                      <el-icon style="width: 100%;height: 100%;" ><IconEpPlus/></el-icon>
                  </template>
                    <div>
                      <p>
                        <el-input
                          v-model="searchName"
                          clearable
                          placeholder="请输入姓名/电话搜索"
                          @input="getManagerUser(manager.user)"
                        />
                      </p>
                      <el-row class="overflow_y_200">
                        <el-checkbox-group v-model="manager.user">
                          <el-col
                            v-for="v in managerList(manager.caretaker)"
                            :key="v.id"
                            :span="24"
                            class="padding_col_10"
                          >
                            <el-checkbox :label="v.id">
                              {{ v.name }} {{ v.tel }}
                            </el-checkbox>
                          </el-col>
                        </el-checkbox-group>
                      </el-row>
                    </div>
                  </el-popover>
                </span>
              </div>
            </li>
          </ul>
        </el-card>
        <el-card class="card_box">
          <h3 class="card_title">债务人信息</h3>
          <el-row :gutter="20">
            <el-col :span="colSpan">
              <el-form-item label="企业名称" prop="debtorCompanyName">
                <el-input
                  v-model="subForm.debtorCompanyName"
                  placeholder="请输入企业名称"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="colSpan">
              <el-form-item label="企业信用代码" prop="socialCreditCode">
                <el-input
                  v-model="subForm.socialCreditCode"
                  placeholder="请输入企业信用代码"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <footer class="case_create_btn">
        <el-button @click="$router.back()">取 消</el-button>
        <el-button
          v-loading="subLoading"
          type="primary"
          @click="onSubmit"
          >新 增</el-button
        >
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const appStore = useAppStore()
    const userPhoto = new URL('/src/assets/images/portrait.png', import.meta.url).href
    const { emailValid, creditCodeValid } = useValidate()
    const rules = {
      caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
      courtName: [{ required: true, message: '请输入受理法院', trigger: 'blur' }],
      procedure: [{ required: true, message: '请选择破产程序', trigger: 'blur' }],
      caseStage: [{ required: true, message: '请选择案件阶段', trigger: 'blur' }],
      declareEndDate: [{ required: true, message: '请选择债权申报截止日期', trigger: 'blur' }],
      managerDecisionFileFileNumber: [{ required: true, message: '请输入指定破产管理人决定文书号', trigger: 'blur' }],
      liquidationOrderFileFileNumber: [{ required: true, message: '请输入受理破产清算裁定文书号', trigger: 'blur' }],
      firstMeetingDate: [{ required: true, message: '请选择第一次债权人会议时间', trigger: 'blur' }],
      declareStartDate: [{ required: true, message: '请选择债权申报开始日期', trigger: 'chane' }],
      custodianPhone: [
        { required: true, message: '请输入管理人联系方式', trigger: 'blur' },
      ],
      custodianEmail: [
        { required: true, message: '请输入团队邮箱', trigger: 'blur' },
        { validator: emailValid, trigger: 'blur' },
      ],
      custodianAddress: [{ required: true, message: '请输入管理人地址', trigger: 'blur' }],
      firstMeetingAddress: [{ required: true, message: '请输入会议地址', trigger: 'blur' }],
      notice: [{ required: true, message: '请输入公告说明', trigger: 'blur' }],
      declareAddress: [{ required: true, message: '请输入申报地点', trigger: 'blur' }],
      debtorCompanyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
      socialCreditCode: [
        { required: true, message: '请输入企业信用代码', trigger: 'blur' },
        { validator: creditCodeValid, trigger: 'blur' },
      ],
    }
    return { appStore, rules, userPhoto }
  },
  data() {
    return {
      searchName: '', // 团队成员搜索
      colSpan: 8, // 每个表单项占据的24栅格列数
      subForm: {
        caseName: '',
        courtName: '',
        procedure: '',
        caseStage: '',
        declareEndDate: '',
        managerDecisionFileFileNumber: '',
        liquidationOrderFileFileNumber: '',
        firstMeetingDate: '',
        declareStartDate: '',
        custodianPhone: '',
        custodianEmail: '',
        custodianAddress: '',
        firstMeetingAddress: '',
        notice: '',
        declareAddress: '',
        debtorCompanyName: '',
        socialCreditCode: '',
      },
      subLoading: false,
      // 文件回显
      inFileList: {
        managerDecisionFile: [],
        liquidationOrderFile: [],
      },
      // 文件上传进度
      loading: {
        liquidation: 0,
        manager: 0,
      },
      dict: {
        bankruptCaseType: [], // 案件阶段选项
        bankruptProgram: [], // 破产程序
      },
      // 管理人团队成员
      manager: {
        // 案件负责人
        leader: {
          userPhotoPath: '',
          userName: '',
        },
        // 项目管理人员
        caretaker: [],
        // 项目成员
        user: [],
        // 查询到的人员列表
        list: {},
        cache: {},
      },
    }
  },
  watch: {
    'manager.user'(ids) {
      ids.forEach((id) => {
        this.manager.cache[id] = this.manager.list[id]
      })
    },
    'manager.caretaker'(ids) {
      ids.forEach((id) => {
        this.manager.cache[id] = this.manager.list[id]
      })
    },
  },
  created() {
    const userPhotoPath = this.appStore.userInfo.userPhotoPath
    if (userPhotoPath) {
      this.manager.leader.userPhotoPath =
        userPhotoPath.search('https') === -1
          ? import.meta.env.VITE_OBS_URL + userPhotoPath
          : userPhotoPath
    } else {
      this.manager.leader.userPhotoPath = this.userPhoto
    }
    this.manager.leader.userName = this.appStore.userInfo.fullName
    this.getDict()
    this.getManagerUser()
  },
  methods: {
    // 从管理人团队成员中过滤掉 filterIds 中包含的id
    managerList(filterIds = []) {
      const curUserId = this.appStore.userInfo.userId
      return Object.values(this.manager.list).reduce((acc, cur) => {
        if (!filterIds.includes(cur.id) && curUserId !== cur.id) { acc[cur.id] = cur }
        return acc
      }, {})
    },
    firstMeetingDateDisabled(date) {
      const cur = Date.now() - 24 * 60 * 60 * 1000
      const start = new Date(date).getTime()
      return start < cur
    },
    // 债权申报开始日期不能晚于结束日期
    declareStartDateDisabled(date) {
      const cur = Date.now() - 24 * 60 * 60 * 1000
      const start = new Date(date).getTime()
      if (this.subForm.declareEndDate) {
        const end = new Date(this.subForm.declareEndDate).getTime()
        return start >= end || start < cur
      } else {
        return start < cur
      }
    },
    // 债权申报截止日期不能早于开始日期
    declareEndDateDisabled(date) {
      const cur = Date.now() - 24 * 60 * 60 * 1000
      const end = new Date(date).getTime()
      if (this.subForm.declareStartDate) {
        const start = new Date(this.subForm.declareStartDate).getTime()
        return start >= end
      } else {
        return end < cur
      }
    },
    // 获取字典
    async getDict() {
      try {
        const dictKey = ['bankruptCaseType', 'bankruptProgram']
        const resList = await Promise.all(
          dictKey.map((code) => getDictApi({ code }))
        )
        resList.forEach((res, i) => {
          if (res.success) {
            this.dict[dictKey[i]] = res.data.map((v) => ({
              value: v.id,
              label: v.dictLabel,
            }))
          } else {
            ElMessage.error(res.msg)
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    // 获取管理人团队成员
    async getManagerUser(ids = []) {
      try {
        const params = {
          companyId: this.appStore.userInfo.companyId,
          pageNum: 1,
          pageSize: 100,
          userName: this.searchName,
          ids,
        }
        const res = await getCaseUserByCompanyApi(params)
        if (res.success) {
          if (!res.data) return false
          this.manager.list = res.data.records.reduce((acc, cur) => {
            const {
              userId: id,
              phone: tel,
              userPhotoPath: avatar,
              chineseName: name,
            } = cur
            acc[id] = { id, tel, name }
            if (avatar) {
              acc[cur.userId]['avatar'] =
                avatar.search('https') === -1
                  ? import.meta.env.VITE_OBS_URL + avatar
                  : avatar
            } else {
              acc[cur.userId]['avatar'] = this.userPhoto
            }
            return acc
          }, {})
        } else {
          console.error(res)
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async onSubmit() {
      try {
        this.subLoading = true
        const validate = await this.$refs.subFormRef.validate()
        if (!validate) return false
        if (this.manager.caretaker.length === 0) {
          ElMessage.warning('请选择项目主管')

          return false
        }
        if (this.manager.user.length === 0) {
          ElMessage.warning('请选择项目成员')
          return false
        }
        if (this.inFileList.managerDecisionFile.length === 0) {
          ElMessage.warning('请上传指定破产管理人决定书')
          return false
        }
        if (this.inFileList.liquidationOrderFile.length === 0) {
          ElMessage.warning('请上传受理批产清算裁定书')
          return false
        }
        const {
          managerDecisionFileFileNumber,
          liquidationOrderFileFileNumber,
          ...params
        } = this.subForm
        // 破产管理人决定书信息
        params.managerDecisionFile = {
          fileName: this.inFileList.managerDecisionFile[0]['fileName'],
          filePath: this.inFileList.managerDecisionFile[0]['filePath'],
          fileNumber: managerDecisionFileFileNumber,
        }
        // 破产清算裁定书信息
        params.liquidationOrderFile = {
          fileName: this.inFileList.liquidationOrderFile[0]['fileName'],
          filePath: this.inFileList.liquidationOrderFile[0]['filePath'],
          fileNumber: liquidationOrderFileFileNumber,
        }
        params.companyId = this.appStore.userInfo.companyId
        params.createUser = this.appStore.userInfo.userId
        params.projectMembers = {
          // 项目主管
          admin: this.manager.caretaker,
          // 项目成员
          member: this.manager.user,
        }
        const res = await postCreateCaseApi(params)
        if (res.success) {
          ElMessage.success(res.msg)
          this.$router.back()
        } else {
          ElMessage.error(res.msg)
        }
      } catch (error) {
        console.error(error)
        const keys = Object.keys(error)
        const msg =
          keys.length && Object.prototype.hasOwnProperty.call(this.subForm, keys[0]) ? ElMessage.error(error[keys[0]][0]['message'])
            : error.message
        ElMessage.error(msg)
      } finally {
        this.subLoading = false
      }
    },
  },
}
</script>

<style scoped>
.el-select,
.el-date-editor {
  width: 100% !important;
}

.padding_col_10 {
  padding-top: 10px;
  padding-bottom: 10px;
}
.overflow_y_200 {
  height: 200px;
  overflow-y: auto;
}

.case_create {
  position: relative;
  width: 100%;
  height: 100%;
}
.breadcrumb {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #999;
  position: absolute;
  left: 0;
  top: -30px;
}
.breadcrumb_hover:hover {
  cursor: pointer;
  color: #333;
}
.project_title {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
  font-weight: bolder;
}
.case_create_body {
  height: calc(100% - 60px);
  overflow-y: auto;
}
.card_box {
  margin: 20px;
}
.card_title {
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}
.card_title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  background: var(--primary-color-400);
  margin-right: 5px;
}
.file_number {
  position: relative;
}
.file_number_upload {
  position: absolute;
  right: 0;
  top: -34px;
  cursor: pointer;
  color: var(--primary-color);
  text-align: right;
}
.file_number_upload:hover {
  text-decoration: underline;
}
.file_number_upload::before {
  content: '*';
  position: absolute;
  right: 4em;
  top: 0.1em;
  color: red;
}
.file_number_file {
  width: 100%;
  gap: 10px;
  position: absolute;
  right: 0;
  top: -30px;
  display: grid;
  text-align: right;
  align-items: center;
  justify-items: end;
  grid-template-columns: 1fr 30px;
}
.file_number_file_name {
  font-size: 12px;
  color: #c1b39f;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
  padding-left: 40%;
}
.el-icon-delete {
  cursor: pointer;
  color: red;
}
.case_create_manager {
  padding: 20px 50px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
.case_create_manager > li {
  font-size: 14px;
  box-sizing: border-box;
}
.case_create_manager > li:nth-child(1) {
  width: 100%;
  padding-bottom: 20px;
}
.case_create_manager > li:nth-child(2) {
  width: 50%;
  padding-right: 10px;
}
.case_create_manager > li:nth-child(3) {
  width: 50%;
  padding-left: 10px;
}
.case_create_manager_title {
  line-height: 3em;
  position: relative;
}
.case_create_manager_title ::before {
  content: '*';
  position: absolute;
  top: 0;
  left: -0.8em;
  color: red;
}
.case_create_manager_user {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  row-gap: 20px;
}
.case_create_manager_user > span {
  width: 150px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--primary-color-100);
  border-radius: 36px;
  position: relative;
}
.el-icon-close {
  position: absolute;
  right: 1em;
  color: var(--primary-color);
  cursor: pointer;
}
.el-icon-close:hover {
  color: red;
}
.case_create_manager_user_add {
  width: 36px !important;
  display: block;
    height: 36px;
    line-height: 36px;
    text-align: center;
  border: 1px dashed var(--primary-color);
  border-radius: 50%;
  color: var(--primary-color);
  cursor: pointer;
}
.case_create_btn {
  width: 100%;
  padding: 20px 100px;
  display: flex;
  justify-content: center;
  gap: 100px;
  box-sizing: border-box;
}
</style>
