import { request, ResponseType } from '@/utils/request';

// 电量监视-日期总览
export const getPowerMonitApi = (params: {
  dateType: string;
  date: string;
  deptId: number;
  userId: number;
}): Promise<ResponseType<null>> =>
  request({
    url: `/power/deviation/app/powerMonit`,
    method: 'get',
    params,
  });
