// import { http } from '@/shared/utils/request'
import { callEdgeFunctionApi } from '@/edgeFunction'
import type { AxiosResponse } from 'axios'

export interface User {
    id?: string,
    email: string,
    password?: string,
    name: string,
    phone?: string,
    roles?: string[],
}

// /auth/v1/signup
// user_metadata

// 新增
export const createUserApi = (user: User) => callEdgeFunctionApi({ name: 'create_user', user })
// 查询
export const getUsersApi = async ({ page = 1, limit = 10 }: { page?: number, limit?: number }): Promise<AxiosResponse<Array<User>> & { total: number }> => {
    const res = await callEdgeFunctionApi({ name: 'get_users_list', page, perPage: limit})
    if (res.status !== 200) return res
    const { total, users } = res.data
    const data = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        phone: user.user_metadata.phone,
        roles: user.user_metadata.roles
    }))
    res.data = data
    return { ...res, total }
}

export const editUserApi = (user: User) => callEdgeFunctionApi({ name: 'edit_user', user })

// 删除
async function deleteUser(id: string) {
    
}