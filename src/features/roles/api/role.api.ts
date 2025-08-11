import { http } from '@/shared/utils/request'

export interface Role {
    id: string
    name: string
    description: string
}
export async function fetchRolesApi({ name = '', page = 1, limit = 10 }: { name?: string, page?: number, limit?: number }) {
    const offset = (limit * page) - limit
    return await http.get(`/rest/v1/roles?select=id%2Cname%2Cdescription&name=like.%25${name}%25&offset=${offset}&limit=${limit}`)
}
