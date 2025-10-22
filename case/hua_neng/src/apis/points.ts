import { request, ResponseType } from '@/utils/request';

export interface Point {
  creatTime: string;
  id: string;
  purpose: string;
  remark: string;
  residueScore: number;
  score: number;
  type: string;
  userId: number;
}

// 积分列表
export const getPointsListApi = (params: {
  userId: number;
  start: string;
  end: string;
  type: string | null;
  pageNum: number;
  pageSize: number;
}): Promise<
  ResponseType<null> & {
    rows: Array<Point>;
    total: number;
    othInfo: { income: number; expenditure: number; totalScore: number };
  }
> =>
  request({
    url: `/score/app/scoreDetailByDate`,
    method: 'get',
    params,
  });

// 查询总积分
export const getPointsTotalApi = (params: {
  userId: number;
}): Promise<ResponseType<{ totalScore: number }>> =>
  request({
    url: `/score/app/totalScore`,
    method: 'get',
    params,
  });

// 查询过期时间
export const getPointsExpireTimeApi = (params: {
  userId: number;
}): Promise<ResponseType<{ expireTime: string }>> =>
  request({
    url: `/score/app/expireTime`,
    method: 'get',
    params,
  });
