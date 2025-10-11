import { supabase } from "@/libs/supabase"
import { IProfile } from "./UserServices"

const TABLE_NAME = 'expenses'

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

type IExpenseCreate = Omit<IExpense, 'id' | 'created_at' | 'profiles' | 'expense_splits'>

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
  async add(expense: IExpenseCreate) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([expense])
      .select('*')
    if (error) throw error
    return data[0]
  },
}
