import { request, ResponseType } from '@/utils/request';

// 运行日类型
export enum RunType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export const dict: Readonly<Record<RunType, string>> = {
  DAY: '日',
  WEEK: '周',
  MONTH: '月',
};

export interface Schema {
  reportId?: string; // 填报id
  settingId: number;
  dateType: RunType;
  stopTime: string; // 填报结束日期
  runDay: string; // 运行日期
  dayDesc: string;
  reportPower: string; // 填报电量
  reportTime?: string;
  status: '0' | '1' | '-1'; // -1 查看 0 填报 1编辑
}

// 电量列表
export const getPowerListApi = (
  params: {
    deptId?: string;
  } = {},
): Promise<ResponseType<Array<Schema>>> =>
  request({
    url: `/power/report/app/list`,
    method: 'get',
    params,
  });

// 电量填报
export const postAddPowerApi = (data) =>
  request({
    url: `/power/report/app/fill`,
    method: 'post',
    data,
  });

// 电量填报-详情
export const getPowerDetailApi = (params: { id: string }) => {
  return request({
    url: `/power/report/app/fill/info`,
    method: 'get',
    params,
  });
};

// 积分设置查询
export const getScoreSettingApi = (params: {
  settingId: number;
}): Promise<
  ResponseType<
    Array<{
      id: string;
      start: number;
      end: number;
      score: number;
      settingId: number;
    }>
  >
> => {
  return request({
    url: `/power/report/getScoreSetting`,
    method: 'get',
    params,
  });
};

// 相似日电量
export const getSimilarPowerApi = (params: {
  settingId: number | string;
  deptId: string | string;
  date: string;
  type: RunType | string;
}) => {
  return request({
    url: `/power/report/app/similarday`,
    method: 'GET',
    params,
  });
};
