import { supabase } from "@/libs/supabase"

const TABLE_NAME = 'group_members'
type IGroupMember = {
  id?: string,
  group_id: string,
  user_id: string,
  role: string
}

export const groupMemberServices = {
  async add(groupMember: Omit<IGroupMember, 'id'>) {
    const { data, error } = await supabase.from(TABLE_NAME)
      .insert([groupMember])
      .select()
    if (error) throw error
    return data[0]
  }
}
