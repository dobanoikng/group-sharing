import { supabase } from '@/libs/supabase'

const TABLE_NAME = 'groups'

export interface Group {
  id: number
  name: string
  description?: string
  created_by: string
  created_at: string
}

export const groupService = {
  // 📌 Thêm todo mới
  async add(group: Omit<Group, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([group])
      .select()
    if (error) throw error
    return data[0]
  },

  // 📌 Lấy danh sách todos
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(`*, group_members(*, profiles(*))`)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  // 📌 Sửa todo theo id
  async update(id: string, updates: Partial<Group>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  // 📌 Xóa todo theo id
  async remove(id: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
  async detail(id: string) {
    const { data, error } = await supabase.from(TABLE_NAME)
      .select('*')
      .eq('id', id)
    if (error) throw error
    return data[0]
  }
}
