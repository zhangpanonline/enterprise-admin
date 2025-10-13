<template>
  <div class="case_edit">
    <!-- 面包屑 -->
    <p class="breadcrumb">
      <span class="breadcrumb_hover" @click="$router.back()">案件列表</span>
      <i class="el-icon-arrow-right"></i>
      <span>{{ tab[tabKey] }}</span>
    </p>
    <!-- 头部 -->
    <div class="project_title">
      <span>{{ detail.caseName }}</span>
      <el-button size="mini" type="primary" @click="$router.back()">返回</el-button>
    </div>
    <!-- tab -->
    <!-- 当createUser为空，则只能看到案件信息，进行认领 -->
    <el-tabs v-if="!detail.createUser" v-model="tabKey" @tab-click="tabKey = $event.paneName">
      <el-tab-pane :label="tab.info" name="info">
        <Info v-if="tabKey === 'info'" :case="detail" @debtorCompanyName="debtorCompanyName = $event" @updateCreateUser="detail.createUser = $event; detail.edit = 'true'" />
      </el-tab-pane>
    </el-tabs>
    <!-- 当前用户统一权限角色是否有且仅是 第三方机构时，只能查看案件资料汇总 -->
    <el-tabs v-else-if="is_bankrupt_third_party" @tab-click="tabKey = $event.paneName" v-model="tabKey">
      <el-tab-pane :label="tab.info" name="info">
        <Info v-if="tabKey === 'info'" :case="detail" @debtorCompanyName="debtorCompanyName = $event" />
      </el-tab-pane>
      <el-tab-pane :label="tab.file" name="file">
        <File v-if="tabKey === 'file'" :case="detail" :role="role" />
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-else v-model="tabKey" @tab-click="tabKey = $event.paneName">
      <el-tab-pane :label="tab.info" name="info">
        <Info v-if="tabKey === 'info'" :case="detail" @debtorCompanyName="debtorCompanyName = $event" />
      </el-tab-pane>
      <el-tab-pane :label="tab.progress" name="progress">
        <Progress v-if="tabKey === 'progress'" :case="detail" />
      </el-tab-pane>
      <el-tab-pane :label="tab.team" name="team">
        <Team v-if="tabKey === 'team'" :case="detail" />
      </el-tab-pane>
      <el-tab-pane :label="tab.wealth" name="wealth">
        <Wealth v-if="tabKey === 'wealth'" :caseInfo="detail" />
      </el-tab-pane>
      <el-tab-pane :label="tab.creditor" name="creditor">
        <Creditor v-if="tabKey === 'creditor'" :case="detail" :debtor-company-name="debtorCompanyName" :role="role" />
      </el-tab-pane>
      <template v-if="isDev">
        <el-tab-pane :label="tab.template" name="template">
          <Report v-if="tabKey === 'template'" :case="detail" />
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane v-if="role.org === MANAGE" :label="tab.template" name="template">
          <Report v-if="tabKey === 'template'" :case="detail" />
        </el-tab-pane>
      </template>
      <el-tab-pane :label="tab.file" name="file">
        <File v-if="tabKey === 'file'" :case="detail" :role="role" />
      </el-tab-pane>
      <template v-if="isDev">
        <el-tab-pane :label="tab.meeting" name="meeting">
          <Meeting v-if="tabKey === 'meeting'" :case="detail" :role="role" />
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane v-if="role.org === MANAGE" :label="tab.meeting" name="meeting">
          <Meeting v-if="tabKey === 'meeting'" :case="detail" :role="role" />
        </el-tab-pane>
      </template>
      <el-tab-pane :label="tab.memo" name="memo">
        <Memo v-if="tabKey === 'memo'" :case="detail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Info from './Info.vue'
import Team from './Team.vue'
import Wealth from './wealth/index.vue'
import Creditor from './creditor/index.vue'
import Report from './Report.vue'
import File from './file/index.vue'
import Meeting from './meeting.vue'
import Progress from './progress/index.vue'
import Memo from './memo/index.vue'
import {
  MANAGE,
  SUPERVISE,
  DEBTOR,
  MANAGE_HEAD,
  MANAGE_MANAGER,
  MANAGE_MEMBER,
  CASE_EDIT_TABLE_KEY,
  AUTH_LAW_CREATER,
  AUTH_LAW_MANAGER,
  AUTH_GLRCY,
  AUTH_PCDSFJG,
  AUTH_PCZWR,
  AUTH_THIRD_PARTY
} from '@/constant'
export default {
  components: {
    Info,
    Team,
    Creditor,
    Report,
    File,
    Meeting,
    Progress,
    Memo,
    Wealth,
  },
  setup() {
    const appStore = useAppStore()
    // 当前用户统一权限角色是否有且仅是 第三方机构
    const is_bankrupt_third_party = computed(() => {
      // 'bankrupt_law_creater', 'bankrupt_law_manager', 'glrcy',       'PCDSFJG',     'PCZWR'     'bankrupt_third_party'
      // 破产-律所创建人、          破产-律所管理员、       破产管理人-成员、监督机构（法院）、破产债务人、第三方机构
      const authorities = [AUTH_LAW_CREATER, AUTH_LAW_MANAGER, AUTH_GLRCY, AUTH_PCDSFJG, AUTH_PCZWR]
      const bool1 = appStore.authorities.some(v => authorities.includes(v))
      const bool2 = appStore.authorities.some(v => v === AUTH_THIRD_PARTY)
      const bool = !bool1 && bool2
      return bool
    })
    const isDev = import.meta.env.DEV
    return { appStore, is_bankrupt_third_party, isDev }
  },
  data() {
    return {
      MANAGE,
      tab: {
        info: '案件信息',
        progress: '案件进度',
        team: '案件团队',
        wealth: '资产管理',
        creditor: '债权人管理',
        template: '申报模板',
        file: '案件资料汇总',
        meeting: '债权会议管理',
        memo: '跟进记录',
      },
      tabKey: 'info',
      debtorCompanyName: '', // 债务人公司名称
      detail: {},
      role: {
        org: '',
        member: '',
      },
    }
  },
  created() {
    this.getCurTab()
    this.detail = this.$route.query
    this.getRole()
  },
  methods: {
    // 判断当前是否从债权会议管理详情返回的
    getCurTab() {
      const meetQueryStr = window.localStorage.getItem(CASE_EDIT_TABLE_KEY)
      if (meetQueryStr) {
        this.tabKey = 'meeting'
        window.localStorage.setItem(CASE_EDIT_TABLE_KEY, '')
      } else {
        this.tabKey = 'info'
      }
    },
    // 获取角色id
    async getRole() {
      try {
        //         三方id：
        // 破产-管理人团队:3fda4fd73fb14834b26076c1af439b60
        // 破产-监督机构（法院）:70f896f117154daa82a308fcb6cc617b
        // 破产-债务人:b8a12fdd6cbe412cb9759770f490e823

        // 管理人团队角色id：
        // 项目负责人:026e9230d385485d84c14c4a8f1a9124
        // 项目管理员:91c5a6802dae4aa0aae96b40d12815c8
        // 项目成员:aa9ace3cc7294a50a62ba70341aa11e1
        const role = {
          '3fda4fd73fb14834b26076c1af439b60': MANAGE, // 管理人团队
          '70f896f117154daa82a308fcb6cc617b': SUPERVISE, // 监督机构(法院)
          'b8a12fdd6cbe412cb9759770f490e823': DEBTOR, // 债务人
          '026e9230d385485d84c14c4a8f1a9124': MANAGE_HEAD, // 管理人团队-项目负责人
          '91c5a6802dae4aa0aae96b40d12815c8': MANAGE_MANAGER, // 管理人团队-项目管理员
          'aa9ace3cc7294a50a62ba70341aa11e1': MANAGE_MEMBER, // 管理人团队-项目成员
        }
        const res = await permissionsRoleApi({ projectId: this.detail.projectId, userId: this.appStore.userInfo.userId })
        if (res.success) {
          const { companyType, roleId } = res.data || {}
          this.role.org = role[companyType]
          this.role.member = role[roleId]
        } else {
          console.error(res)
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.case_edit {
  position: relative;
  overflow: hidden;
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
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
  font-weight: bolder;
}
.el-tabs {
  height: calc(100% - 39px);
}
:deep(.el-tabs .el-tabs__content) {
  height: calc(100% - 60px);
}
.el-tabs :deep(.el-tabs__content .el-tab-pane) {
  height: 100%;
  overflow: hidden;
}
:deep(.el-tabs__header) {
  padding: 0 20px;
  margin: 0;
}
</style>
