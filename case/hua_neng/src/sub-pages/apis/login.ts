import { request, ResponseType } from '@/utils/request';
// 登录
type LoginParams = {
  username: string;
  password: string;
};
export const loginApi = (
  data: LoginParams,
): Promise<ResponseType<null> & { token: string }> =>
  request({
    url: `/login`,
    method: 'post',
    data,
  });

// 注册
export interface RegisterParams {
  userName: string;
  name: string;
  companyName: string;
  elecAccount: string;
  phone: string;
  loginPassword: string;
  secondPassword: string;
}
export const registerApi = (data: RegisterParams): Promise<ResponseType> =>
  request({
    url: `/account/management/register`,
    method: 'post',
    data,
  });
