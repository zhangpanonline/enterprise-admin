import { request, ResponseType } from '@/utils/request';

export interface User {
  admin: boolean;
  avatar: null;
  createBy: string;
  createTime: string;
  delFlag: string;
  dept: Dept;
  deptId: number;
  email: null;
  loginDate: string;
  loginIp: string;
  name: null;
  nickName: string;
  params: UserParams;
  password: string;
  phonenumber: string;
  postIds: null;
  pwdUpdateDate: string;
  remark: string;
  roleId: null;
  roleIds: null;
  roles: Role[];
  sex: string;
  status: string;
  updateBy: null;
  updateTime: null;
  userId: number;
  userName: string;
  [property: string]: any;
}

interface Dept {
  adders: null;
  ancestors: string;
  children: any[];
  createBy: null;
  createTime: null;
  delFlag: null;
  deptId: number;
  deptName: string;
  elecAccount: null;
  email: null;
  industry: null;
  leader: string;
  orderNum: number;
  params: DeptParams;
  parentId: number;
  parentName: null;
  phone: null;
  remark: null;
  status: string;
  updateBy: null;
  updateTime: null;
  [property: string]: any;
}

interface DeptParams {
  '@type': string;
  [property: string]: any;
}

interface UserParams {
  '@type': string;
  [property: string]: any;
}

interface Role {
  admin?: boolean;
  createBy?: null;
  createTime?: null;
  dataScope?: string;
  delFlag?: null;
  deptCheckStrictly?: boolean;
  deptIds?: null;
  flag?: boolean;
  menuCheckStrictly?: boolean;
  menuIds?: null;
  params?: RoleParams;
  permissions?: null;
  remark?: null;
  roleId?: number;
  roleKey?: string;
  roleName?: string;
  roleSort?: number;
  status?: string;
  updateBy?: null;
  updateTime?: null;
  [property: string]: any;
}

interface RoleParams {
  '@type': string;
  [property: string]: any;
}

// 获取用户信息
export const getUserInfoApi = (): Promise<
  ResponseType<null> & { user: User }
> =>
  request({
    url: `/getInfo`,
    method: 'get',
  });
