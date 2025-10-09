import { supabase } from "@/libs/supabase"

const TABLE_NAME = 'expenses'
type IProfile = {
  id: string,
  full_name: string
}
export type IExpense = {
  id: string,
  group_id: string,
  paid_by: string,
  title: string,
  amount: number,
  currency: string,
  created_at: string,
  profiles: IProfile,
  expense_splits: { amount: number, profiles: IProfile }[]
}

export const expenseServices = {
  async getAllFromGroup(groupId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(`*, profiles(*), expense_splits(amount,profiles(*))`)
      .eq('group_id', groupId)
      .order('id', { ascending: true })
    if (error) throw error
    return data
  },
}
