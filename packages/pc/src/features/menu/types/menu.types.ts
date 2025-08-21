export interface MenuItem {
  id: string
  parentId?: string | null
  name: string
  path: string
  icon?: string
  sort?: number
  children?: MenuItem[]
}
