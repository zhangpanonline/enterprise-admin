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

// 修改密码
export const putResetPwdApi = (data: {
  userId: number;
  password: string;
  oldPassword: string;
}): Promise<ResponseType<null>> =>
  request({
    url: `/system/user/app/resetPwd`,
    method: 'put',
    data,
  });

// 小程序重新认证
export const postReCertificationApi = (data): Promise<ResponseType<null>> =>
  request({
    url: `/account/management/reCertification`,
    method: 'post',
    data,
  });
