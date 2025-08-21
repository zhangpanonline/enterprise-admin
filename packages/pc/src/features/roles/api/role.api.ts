import { http } from '@/shared/utils/request'
// import { supabase } from '@/shared/utils/request/supabase'

export interface Role {
    id?: string
    name?: string
    description?: string
}
export async function fetchRolesApi({ name = '', page = 1, limit = 10 }: { name?: string, page?: number, limit?: number }) {
    const offset = (limit * page) - limit
    return await http.get(`/rest/v1/roles?select=id%2Cname%2Cdescription&name=like.%25${name}%25&offset=${offset}&limit=${limit}`, {
        headers: {
            prefer: 'count=exact'
        }
    })
}

// export const fetchRolesApi = () => supabase.from('roles').select(`id,name`, { count: 'exact' }).range(0, 10)
// https://smmexdymolziqxyrvctw.supabase.co/rest/v1/roles?select=id%2Cname&offset=0&limit=11

export const createRoleApi = (role: Role) => http.post('/rest/v1/roles', role)

export const deleteRoleApi = (id: string) => http.delete(`/rest/v1/roles?id=eq.${id}`)

export const editRoleApi = ({ id, ...role }: Role) => http.patch(`/rest/v1/roles?id=eq.${id}`, role)