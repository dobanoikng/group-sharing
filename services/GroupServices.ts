import { supabase } from '@/libs/supabase'

const TABLE_NAME = 'groups'

export interface Group {
  id: string
  name: string
  description?: string
  created_by: string
  created_at: string
}

export const groupService = {
  async add(group: Omit<Group, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([group])
      .select()
    if (error) throw error
    return data[0]
  },

  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(`*, expenses(*), group_members(*, profiles(*))`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Group>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

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
      .select(`*, expenses(*, expense_splits(*))`)
      .eq('id', id)
    if (error) throw error
    return data[0]
  }
}
