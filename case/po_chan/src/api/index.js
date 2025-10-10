import http from './axiosInstance'
import { BANKRUPT_API, MESSAGE_API, SSO_API, AUTH_API } from '@/constant/index.js'
// 登录获取token
export const loginApi = params => http.post(SSO_API + '/login/token', params)
// 判断当前手机号有没有注册
export const checkUser = params => http.post(AUTH_API + '/user/check', params)
// 获取手机号验证码
export const getSms = params => http.post(MESSAGE_API + '/sms/validate/send', params)
// 验证手机验证码
export const getIstrue = params => http.post(MESSAGE_API + '/sms/validate/istrue', params)
// 忘记密码
export const updatePwdForAdmin = params => http.post(AUTH_API + '/user/updatePwdForAdmin', params)
// 修改密码
export const updatePwd = params => http.post(AUTH_API + '/user/updatePwd', params)

// 短信验证码登录
export const phoneLogin = params => http.post(SSO_API + '/login/phone/token', params)
// 图形验证CCC
export const codeCheckApi = params => http.get(SSO_API + '/code/codeCheck', { params })
// 修改用户信息
export const saveUser = params => http.post(AUTH_API + '/user/save', params)
// 获取消息总数
export const getAllCountBySysCode = params => http.post(MESSAGE_API + '/pushLog/getAllCountBySysCode', params)
// 获取通知消息
export const getAllCountPage = params => http.post(MESSAGE_API + '/pushLog/messageLogByUser', params)
// 获取某个产品代办或通知消息(不管已读未读，排序先根据已读未读排序，再根据时间来排序)
export const getUserPushLog = params => http.post(MESSAGE_API + '/pushLog/getUserPushLog', params)
// 根据用户id和系统code更改为已读状态
export const BathReadBySysCode = params => http.post(MESSAGE_API + '/readLog/BathReadBySysCode', params)
// 批量更新已读未读状态
export const batchRead = params => http.post(MESSAGE_API + '/readLog/batchRead', params)

// 资产导出
export const expAssets = params => http.post(BANKRUPT_API + '/bankruptAssets/expAssets', params, { responseType: 'arraybuffer' })
// 资产导出模板
export const expTemplate = params => http.post(BANKRUPT_API + '/bankruptAssets/expTemplate', params, { responseType: 'arraybuffer' })
// 资产导入
export const impAssets = params => http.post(BANKRUPT_API + '/bankruptAssets/impAssets', params, { headers: { 'Content-type': 'multipart/form-data' }})
// 无形资产导出
export const expAssetsInvisible = params => http.post(BANKRUPT_API + '/assetsInvisible/expAssetsInvisible', params, { responseType: 'arraybuffer' })
// 无形资产导出模板
export const expInvisibleTemplate = params => http.get(BANKRUPT_API + '/assetsInvisible/expInvisibleTemplate', { responseType: 'arraybuffer' })
// 无形资产导入
export const impAssetsInvisible = params => http.post(BANKRUPT_API + '/assetsInvisible/impAssetsInvisible', params, { headers: { 'Content-type': 'multipart/form-data' }})
// 注册
export const setRegister = params => http.post(AUTH_API + '/user/bankruptRegister', params)
// 获取用户详细信息
export const getUserInfoApi = ({ token, loginName }) => http.post(BANKRUPT_API + `/user/loginForOther?access_token=${token}`, { loginName })
// 获取菜单
export const getMenuApi = params => http.post(BANKRUPT_API + '/menu/queryTree', params)
// 获取案件菜单
export const getCaseMenuApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/findCaseMenu', params)

// 获取案件列表
export const getCaseListApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/findForPage', params)
// 获取字典项
export const getDictApi = params => {
  // 破产程序与小程序端一致，所以这里直接写死
  if (params.code === 'bankruptProgram') {
    return Promise.resolve({
      success: true,
      msg: '查询成功',
      data: [
        { id: '0', dictLabel: '破产清算', label: '破产清算' },
        { id: '1', dictLabel: '破产重整', label: '破产重整' },
        { id: '2', dictLabel: '和解', label: '和解' },
        { id: '3', dictLabel: '强制清算', label: '强制清算' },
        { id: '4', dictLabel: '破产预重整', label: '破产预重整' },
      ],
    })
  } else {
    return http.get(BANKRUPT_API + '/lookDict/findByCode', { params })
  }
}
// 新增案件
export const postCreateCaseApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/saveBankruptDebtor', params)
// 修改案件
export const postEditCaseApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/updateBankruptDebtor', params)
// 修改案件状态
export const postChangeStatusCaseApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/updateStatusById', params)
// 查看案件详情
export const getCaseDetailApi = projectId => http.post(BANKRUPT_API + '/bankruptDebtor/findDebtorById', { projectId })
// 查询公司下人员信息
export const getCaseUserByCompanyApi = params => http.post(BANKRUPT_API + '/projectMembers/getCompanyUser2', params)
export const getCaseMembersByCompanyApi = params => http.post(BANKRUPT_API + '/projectMembers/findPageBankruptManagerUsers', params)
// 公司树
export const getTreeCompanyApi = projectId => http.post(BANKRUPT_API + '/systemCompany/findBankruptTreeByProjectId', { projectId })
// 查询第三方下的公司列表
export const getCompanyByThreeApi = params => http.post(BANKRUPT_API + '/systemCompany/findListByProjectIdAndCompanyType', params)
// 添加企业-企业列表查询
export const getCompanylistApi = params => http.post(BANKRUPT_API + '/systemCompany/findForPage', params)
// 项目文件文件查询
export const getFileListApi = params => http.post(BANKRUPT_API + '/bankruptFile/findAll', params)
/**
 * 添加文件、文件
 */
export const addCaseFileApi = params => http.post(BANKRUPT_API + '/bankruptFile/saveBankruptFiles', params)
// 历史记录
export const getCaseFileHistroyApi = params => http.post(BANKRUPT_API + '/bankruptFile/getFileRecords', params)
// 重命名
export const renameCaseFileNameApi = params => http.post(BANKRUPT_API + '/bankruptFile/updName', params)
// 修改文件状态 -- 删除 "status": 0:正常  -3:删除
export const updateCaseFileStatueApi = ({ id, status }) => http.post(BANKRUPT_API + '/bankruptFile/updStatus', { id, status })
// 文件属性查询
export const getCaseFileAttrApi = params => http.get(BANKRUPT_API + '/bankruptFile/findById/' + params.id)
// 文件夹下载
export const downloadCaseFileApi = id => http({
  url: BANKRUPT_API + '/bankruptFile/download/' + id,
  method: 'GET',
  responseType: 'blob',
  headers: {
    'content-type': 'application/octet-stream;charset=utf-8',
  },
})
// 文件夹下载前校验
export const downloadCheckCaseFileApi = id => http.get(BANKRUPT_API + '/bankruptFile/downloadCheck/' + id)
// 树形文件夹并显示文件数
export const findFolderTreeApi = ({ projectId }) => http.post(BANKRUPT_API + '/bankruptFile/findFolderTree', { projectId })
// 获取当前用户对案件资料的下载、删除权限
export const getbankruptManagerOneApi = projectId => http.get(BANKRUPT_API + '/bankruptManager/getOne', { params: { projectId }})

/**
 * 债权人相关接口
 */
// 新增债权人
export const saveCreditorPCApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/saveCreditorPC', params)
// 批量导入债权人
export const importCreditorPCApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/importExcel', params)
// 获取债权列表下的统计信息
export const findCreditorOverviewApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/findCreditorOverview', params)
// 债权人列表分页
export const creditorForPageApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/findForPage', params)
// 获取每个状态下的债权数量
export const creditorFindNumApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/findCreditorNum', params)
// 债权人列表删除
export const creditorDelPageApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/deleteBankruptCreditor', params)
// 批量分配审查人
export const assignReviewerApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/assignReviewer', params)
// 债权列表批量导出
export const creditorExportExcelApi = projectId => {
  return http({
    url: BANKRUPT_API + '/bankruptCreditor/exportCreditor?projectId=' + projectId,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'content-type': 'application/octet-stream;charset=utf-8',
    },
  })
}
// 系统、短信通知
export const creaditorSendNoticeApi = params => http.post(BANKRUPT_API + '/bankruptNotice/saveNoticePC', params)
/**
 * 获取系统、短信通知记录
 * @param {*} params = { projectId: '', pageSize: 10, pageNum: 1, userId: '', sendType: '' }
 * sendType: 1站内消息、2短信
 */
export const creaditorSendNoticeHistoryApi = params => http.post(BANKRUPT_API + '/bankruptNotice/findPageNoticeRecord', params)
// 系统、短信通知记录详情
export const creaditorSendNoticeDetailApi = noticeId => http.get(BANKRUPT_API + '/bankruptNotice/findNoticeRecordDetail', { params: { noticeId }})

/**
 * 债权审定相关接口
 */
// 查看债权信息
export const creaditorAuditFindOneApi = ({ creditorId, moneyDetailId, canReviewer }) => http.get(BANKRUPT_API + '/bankruptCreditor/findCreditorOnePC', { params: { creditorId, moneyDetailId, canReviewer }})
// 编辑债权信息
export const updateCreditorAuditApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/updateCreditorPC', params)
// 生成证据清单下载
export const generateEvidenceListApi = id => http({
  url: BANKRUPT_API + '/bankruptFile/generateDetailed/' + id,
  method: 'GET',
  params: {},
  responseType: 'blob',
  headers: {
    'content-type': 'application/octet-stream;charset=utf-8',
  },
})
// 债权申报登记表下载
export const generateConfirmApi = ({ creditorId, moneyDetailId }) => http({
  url: BANKRUPT_API + '/bankruptFile/generateCreditorDeclare/' + creditorId + '/' + moneyDetailId,
  method: 'GET',
  params: {},
  responseType: 'blob',
  headers: {
    'content-type': 'application/octet-stream;charset=utf-8',
  },
})
// 债权认定
export const editMoneyDetailApi = params => http.post(BANKRUPT_API + '/bankruptDebtor/editMoneyDetail', params)
// 形式审查（驳回or通过）
export const formalityReviewApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/formalityReview', params)
// 设置小红点显示
export const reddotApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/unread', params)

// 点击审查认定修改状态为：审定中
export const reviewingApi = creditorId => http.get(BANKRUPT_API + '/bankruptCreditor/reviewing', { params: { creditorId }})

/**
 * 债权异议
 */
// 债权异议——列表
export const objectionListApi = ({ moneyDetailId, creditorId }) => http.post(BANKRUPT_API + '/bankruptCreditor/findCreditorOpinion', { moneyDetailId, creditorId })
// 债权异议——回复
export const objectionReplyApi = params => http.post(BANKRUPT_API + '/bankruptCreditor/saveCreditorComment', params)

/**
 * 证据材料
 */
// 证据材料——查询
export const evidenceFindApi = creditorId => http.get(BANKRUPT_API + '/bankruptFile/findCreditorFiles/' + creditorId)
// 证据材料——附件上传
export const evidenceAnnexApi = params => http.post(BANKRUPT_API + '/bankruptFile/saveCreditorFile', params)
// 证据材料--证据--新增、编辑
export const evidenceUploadApi = params => http.post(BANKRUPT_API + '/bankruptCreditorEvidence/saveEvidence', params)
// 证据材料--证据--查看
export const evidenceGetDetailApi = creditorId => http.post(BANKRUPT_API + '/bankruptCreditorEvidence/findEvidenceListByCreditorId', { creditorId })
// 证据材料--证据--删除
export const evidenceDelApi = id => http.post(BANKRUPT_API + '/bankruptCreditorEvidence/deleteEvidence', { id })
// 证据材料--证据--关联申报金额
export const getMoneyDetaiList = creditorId => http.get(BANKRUPT_API + 'bankruptDebtor/getMoneyDetaiList?creditorId=' + creditorId)
/**
 * 审查结果书
 */
// 审查结果书——上传
export const resultBoolUploadApi = params => http.post(BANKRUPT_API + '/bankruptFile/saveAuditResultsBook', params)
// 审查结果书——查询
export const findAuditResultsBookApi = creditorId => http.get(BANKRUPT_API + '/bankruptFile/findAuditResultsBook/' + creditorId)
// 审查结果书——删除
export const delAuditResultApi = id => http.get(BANKRUPT_API + '/bankruptFile/delAuditResultsBook/' + id)
/**
 * 债权动态
 */
export const dynamicApi = ({ projectId, creditorId, moneyDetailId, pageNum, pageSize }) => http.get(BANKRUPT_API + '/bankruptCreditor/getCreditorRecords', { params: { projectId, creditorId, moneyDetailId, pageNum, pageSize }})
/**
 * 权限相关接口
 */
export const permissionsRoleApi = ({ projectId, userId }) => http.post(BANKRUPT_API + '/projectMembers/findRoleAndCompanyTypeByProjAndUser', { projectId, userId })
/**
 * 债权会议管理
 */
// 新增/修改
export const meetModifyApi = data => http.post(BANKRUPT_API + '/bankruptMeet/save', data)
// 单个案件会议列表
export const meetFindPageApi = ({ pageNum, pageSize, projectId, meetName }) => http.post(BANKRUPT_API + '/bankruptMeet/findForPage', { pageNum, pageSize, projectId, meetName })
// 开始会议
export const meetStartApi = id => http.get(BANKRUPT_API + '/bankruptMeet/start', { params: { id }})
/**
 * 会议签到
 */
// 参会人列表
export const meetSignListApi = data => http.post(BANKRUPT_API + '/bankruptMeet/findSignForPage', data)
// 签到统计
export const meetSignDetailApi = meetId => http.get(BANKRUPT_API + '/bankruptMeet/getSignStatistics', { params: { meetId }})
// 导出列表
export const meetSignExportApi = params => {
  const url = BANKRUPT_API + '/bankruptMeet/exportExcel'
  return http({
    url,
    params,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'content-type': 'application/octet-stream;charset=utf-8',
    },
  })
}

// 修改签到状态
export const meetSignUpdateApi = ({ meetId, creditorId, signed }) => http.get(BANKRUPT_API + '/bankruptMeet/updateSign', { params: { meetId, creditorId, signed }})
/**
 * 会议文件
 */
// 分页
export const meetFileListApi = data => http.post(BANKRUPT_API + '/bankruptFile/findAllMeetFilesForPage', data)
// 新增
export const meetFileCreateApi = ({ recordId, fileName, filePath }) => http.post(BANKRUPT_API + '/bankruptFile/saveMeetFile', { recordId, fileName, filePath })
// 会议文件操作明细列表
export const meetFileInfoApi = ({ fileId, pageNum, pageSize }) => http.post(BANKRUPT_API + '/bankruptFile/findFileOperationsByIdForPage', { fileId, pageNum, pageSize })
// 删除文件
export const meetFileDelApi = fileId => http.get(BANKRUPT_API + '/bankruptFile/deleteMeetFileById', { params: { fileId }})
// 导出明细
export const meetFileExportApi = fileId => {
  const url = BANKRUPT_API + '/bankruptFile/exportDetails'
  return http({
    url,
    params: { fileId },
    method: 'GET',
    responseType: 'blob',
    headers: {
      'content-type': 'application/octet-stream;charset=utf-8',
    },
  })
}
// 是否允许下载文件
export const meetFileDownAbleApi = ({ fileId, downloadable }) => http.get(BANKRUPT_API + '/bankruptFile/downloadable', { params: { fileId, downloadable }})
/**
 * 决议表决
 */
// 投票列表
export const meetVotePageApi = data => http.post(BANKRUPT_API + '/bankruptMeet/findVoteForPage', data)
// 单个投票债权人列表
export const meetVoteListApi = data => http.post(BANKRUPT_API + '/bankruptMeet/findVoteDetailForPage', data)
// 单个投票统计
export const meetVoteStatisticsApi = data => http.post(BANKRUPT_API + '/bankruptMeet/getVoteStatistics', data)
// 无效投票列表
export const meetVoteValidApi = data => http.post(BANKRUPT_API + '/bankruptMeet/findInvalidVoteForPage', data)
// 修改债权人投票结果
export const meetVoteUpdateApi = data => http.post(BANKRUPT_API + '/bankruptMeet/updateVote', data)
/**
 * 会议存证
 */
// 会议保全书
export const meetDepositGetCertificateApi = (meetId, needGeneratePDF) => http.get(BANKRUPT_API + '/bankruptMeet/certificate', { params: { meetId, needGeneratePDF }})
// 保全记录
export const meetDepositRecordApi = ({ meetId }) => http.get(BANKRUPT_API + '/bankruptFile/query/preservationRecords', { params: { meetId }})
// 音频记录
export const meetDepositListenApi = ({ meetingCode, userName, pageNum, pageSize }) => http.post(BANKRUPT_API + '/bankruptMeet/findAudioForPage', { meetingCode, userName, pageNum, pageSize })
/**
 * 公告
 */
// 公告分页
export const announcementPageApi = params => http.post(BANKRUPT_API + '/bankruptAnnouncement/findPage', params)
// 新增公告
export const announcementSaveApi = data => http.post(BANKRUPT_API + '/bankruptAnnouncement/save', data)
// 编辑公告
export const announcementUpdateApi = data => http.post(BANKRUPT_API + '/bankruptAnnouncement/update', data)
// 公告详情
export const announcementGetApi = id => http.get(BANKRUPT_API + '/bankruptAnnouncement/findOne', { params: { id }})
/**
 * 案件流程
 */
export const flowStageApi = projectId => http.get(BANKRUPT_API + '/bankruptDebtor/flowStage', { params: { projectId }})
/**
 * 首页
 */
// 获取当前用户名下的案件
export const getChangeCaseListApi = () => http.get(BANKRUPT_API + '/bankruptDebtor/getProgressProjectList')
// 获取当前用户名下有多少个进行中的案件
export const getCaseTotalApi = () => http.get(BANKRUPT_API + '/bankruptDebtor/findDisableProjectCount')
// 查询管理人成员
export const getCaseManagerApi = params => http.post(BANKRUPT_API + '/projectMembers/findProjectUser', params)
// 首页详情
export const getCaseHome = projectId => http.get(BANKRUPT_API + '/bankruptDebtor/getBI', { params: { projectId }})
// 图表下钻
export const getCaseHomeNext = params => http.post(BANKRUPT_API + '/bankruptDebtor/getHomeStatisticalDetails', params)
// 卡片下钻
export const getCaseHomeCardNext = params => http.post(BANKRUPT_API + '/bankruptDebtor/getHomeStatisticalDebtorDetails', params)

/**
 * 日报
 */
// 保存修改日志
export const updateDailyApi = params => http.post(BANKRUPT_API + '/bankruptManager/saveBankruptDailyRecord', params)
// 作废日志
export const delDailyApi = id => http.get(BANKRUPT_API + '/bankruptManager/removeBankruptDailyRecord', { params: { id }})
// 分页查询日志
export const getDailyApi = params => http.post(BANKRUPT_API + '/bankruptManager/bankruptDailyRecordFindForPage', params)
// 查询日志汇总
export const getLogRollupApi = params => http.post(BANKRUPT_API + '/bankruptManager/getDailyRecordList', params)
/**
 * 数据中心
 */
// 获取案件占比、案件类型
export const getDataCenter1Api = (params, token = '') => http.post(BANKRUPT_API + '/bankruptDebtor/getCountStatistics', params, { headers: { Authorization: 'Bearer ' + token }})
// 获取认定金额、金额统计
export const getDataCenter2Api = (params, token = '') => http.post(BANKRUPT_API + '/bankruptDebtor/getMoneyStatistics', params, { headers: { Authorization: 'Bearer ' + token }})
// 公司案件按月统计（数量及金额）
export const getDataCenter3Api = (params, token = '') => http.post(BANKRUPT_API + '/bankruptDebtor/getStatisticsByMonth', params, { headers: { Authorization: 'Bearer ' + token }})
// 图表下钻
export const getDataCenterNext = params => http.post(BANKRUPT_API + '/bankruptDebtor/getStatisticalDetails', params)
/**
 * 资产管理
 */
// 分页
export const bankruptAssetsPageApi = params => http.post(BANKRUPT_API + '/bankruptAssets/findForPage', params)
// 新增
export const bankruptAssetsAddApi = params => http.post(BANKRUPT_API + '/bankruptAssets/saveAssets', params)
// 修改
export const bankruptAssetsUpdateApi = params => http.post(BANKRUPT_API + '/bankruptAssets/updateAssets', params)
// 详情
export const bankruptAssetsDetailApi = params => http.post(BANKRUPT_API + '/bankruptAssets/detailsAssets', params)
// 删除
export const bankruptAssetsDelApi = params => http.post(BANKRUPT_API + '/bankruptAssets/removeAssets', params)

// 新增修改
export const updateAssetsInvisibleApi = params => http.post(BANKRUPT_API + '/assetsInvisible/saveOrUpdateAssetsInvisible', params)
// 分页
export const getAssetsInvisibleApi = params => http.post(BANKRUPT_API + '/assetsInvisible/assetsInvisibleList', params)
// 删除
export const delAssetsInvisibleApi = id => http.get(BANKRUPT_API + '/assetsInvisible/deleteAssetsInvisible', { params: { id }})
// 详情
export const detailAssetsInvisibleApi = id => http.get(BANKRUPT_API + '/assetsInvisible/assetsInvisibleDetails', { params: { id }})
// 生成模板
export const downloadFileApi = params => http.post(BANKRUPT_API + '/bankruptManager/download', params)
/**
 * 自定义表单相关接口
 */
// 获取卡片
export const getCustomTableCardApi = params => http.post(BANKRUPT_API + '/templateForm/findFormByFormType', params)
// 获取表格的表头
export const getCustomTableHeaderApi = params => http.get(BANKRUPT_API + '/templateForm/findFormById', { params })
// 获取表格的表头
export const getCustomTableSchemaApi = id => http.get(BANKRUPT_API + '/templateForm/findOne', { params: { id }})
// 查询人员列表
export const getUserNoPage = params => http.post(BANKRUPT_API + '/projectMembers/findProjectUserNoPage', params)
// 分页获取企业成员
export const getFindUserList = params => http.post(BANKRUPT_API + '/projectMembers/findUserList', params)
// 获取企业人员
export const getCompanyUser = params => http.post(BANKRUPT_API + '/projectMembers/getCompanyUser', params)
// 获取项目人员
export const getProjectMembers = params => http.post(BANKRUPT_API + '/projectMembers/findForPage', params)
// 获取选择的项目成员
export const getSaveMembers = params => http.post(BANKRUPT_API + '/projectMembers/saveMembers', params)
export const getFindAllMemberRole = params => http.post(BANKRUPT_API + '/projectMembers/findAllMemberRole', params)
// 选择企业所属
export const setAddCompany = params => http.post(BANKRUPT_API + '/systemCompany/addCompany', params)
// 添加人员
export const saveCompany = params => http.post(BANKRUPT_API + '/systemCompany/saveCompany', params)
export const setSystemCompany = id => http.get(BANKRUPT_API + '/systemCompany/findOne', { params: { id }})
// 删除公司
export const setDelectCompany = params => http.post(BANKRUPT_API + '/systemCompany/delectCompany', params)
export const addPersonToAuth = params => http.post(BANKRUPT_API + '/projectMembers/addPersonToAuth', params)
// 岗位编辑
export const setFindRoleByMemberId = id => http.get(BANKRUPT_API + '/membersRole/findRoleByMemberId', { params: { userId: id }})
// 修改
export const saveMembersRole = params => http.post(BANKRUPT_API + '/membersRole/saveMembersRole', params)
// 用户编辑
export const saveMemberRole = params => http.post(BANKRUPT_API + '/projectMembers/findOneAndMemberRole', params)
// 调离成员
export const saveTransfer = params => http.post(BANKRUPT_API + '/projectMembers/transfer', params)
// 离职
export const saveDimission = params => http.post(BANKRUPT_API + '/projectMembers/dimission', params)
export const savePersonAndProjectMember = params => http.post(BANKRUPT_API + '/projectMembers/updatePersonAndProjectMember', params)
export const saveGetLink = params => http.post(BANKRUPT_API + '/s/getLink', params)
export const getBankruptFile = params => http.post(BANKRUPT_API + '/bankruptFile/findFileListByTreeId', params)
// 删除资料
export const deleteObsFileApi = params => http.post(BANKRUPT_API + '/bankruptFile/deleteBankruptFile', params)
export const saveBankruptFile = params => http.post(BANKRUPT_API + '/bankruptFile/saveBankruptFile', params)
export const getMemoDetails = id => http.get(BANKRUPT_API + '/bankruptManager/memoDetails', { params: { id }})
export const getMemoListApi = params => http.post(BANKRUPT_API + '/bankruptManager/memoList', params)
export const saveOrUpdateMemo = params => http.post(BANKRUPT_API + '/bankruptManager/saveOrUpdateMemo', params)
// 删除案件
export const setDeleteMemo = id => http.get(BANKRUPT_API + '/bankruptManager/deleteMemo', { params: { id }})
export const setKnowledgeVoucherDetails = id => http.get(BANKRUPT_API + '/knowledgeVoucher/knowledgeVoucherDetails', { params: { id }})
export const setLedgeVoucherList = params => http.post(BANKRUPT_API + '/knowledgeVoucher/knowledgeVoucherList', params)
export const saveOrUpdateKnowledgeVoucher = params => http.post(BANKRUPT_API + '/knowledgeVoucher/saveOrUpdateKnowledgeVoucher', params)
// 删除案件
export const deleteKnowledgeVoucher = id => http.get(BANKRUPT_API + '/knowledgeVoucher/deleteKnowledgeVoucher', { params: { id }})
