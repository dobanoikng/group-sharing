import { supabase } from "@/libs/supabase"
import { IProfile } from "./UserServices"

const TABLE_NAME = 'group_members'
export type IGroupMember = {
  id: string,
  group_id: string,
  user_id: string,
  role: string,
  profiles: IProfile
}

export const groupMemberServices = {
  async add(groupMembers: Omit<IGroupMember, 'id' | 'profiles'>[]) {
    const { data, error } = await supabase.from(TABLE_NAME)
      .insert(groupMembers)
      .select()
    if (error) throw error
    return data[0]
  },
  async getAllFromGroup(groupId: string) {
    const { data, error } = await supabase.from(TABLE_NAME)
      .select(`*, profiles(*)`)
      .eq('group_id', groupId)
    if (error) throw error
    return data
  },
  async remove(id: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
