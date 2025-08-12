import { http } from '@/shared/utils/request'

interface User {
    id?: string,
    name: string,
    email: string,
    password: string,
    roles: string[],
}

// /auth/v1/signup
// user_metadata

// 新增
export async function createUserApi(user: User){
    let res = await http.post('/auth/v1/signup', { email: user.email, password: user.password })
    if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.statusText)
    }
    const id = res.data.user.id
    res = await http.post('/rest/v1/users', { id, name: user.name, email: user.email })
    if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.statusText)
    }
    res = await http.post('/rest/v1/user_roles', user.roles.map(role => ({ user_id: id, role_id: role })))
     if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.statusText)
    }
    return {
        code: 200
    }
}

// 查询
export async function getUserApi({ name = '', page = 1, limit = 10 }: { name?: string, page?: number, limit?: number }){
    const offset = (limit * page) - limit
    return await http.get(`/rest/v1/users?select=id%2Cname%2Cemail&name=like.%25${name}%25&offset=${offset}&limit=${limit}`)
}

// 删除
async function deleteUser(id: string) {
    
}