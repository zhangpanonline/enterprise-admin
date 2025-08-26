import { http } from '@/shared/utils/request'
import { supabase } from '@/shared/utils/request/supabase'
import { callEdgeFunctionApi } from '@/edgeFunction'
import type { AxiosResponse } from 'axios'

export interface User {
    id?: string,
    email: string,
    password?: string,
    name?: string,
    phone?: string,
    roles?: string[],
}


// 新增
export const createUserApi = (user: User) => http.post('/auth/v1/signup', {
    email: user.email,
    password: user.password,
    data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
    }
})
// 查询
export const getUsersApi = async ({ page = 1, limit = 10 }: { page?: number, limit?: number }): Promise<AxiosResponse<Array<User>> & { total: number }> => {
    const res = await callEdgeFunctionApi({ function_name: 'get_users_list', page, perPage: limit})
    if (res.status !== 200) return res
    const { total, users } = res.data
    const data = users.map((user: any) => ({
        id: user.id,
        email: user.user_metadata.email,
        name: user.user_metadata.name,
        phone: user.user_metadata.phone,
        roles: user.user_metadata.roles
    }))
    res.data = data
    return { ...res, total }
}

export const editUserApi = (user: User) => callEdgeFunctionApi({ function_name: 'update_user', user })
// export const editUserApi = (user: User) => supabase.functions.invoke('update_user', { body: user })

// 删除
export const deleteUserApi = (id: string) => callEdgeFunctionApi({ function_name: 'delete_user', id })