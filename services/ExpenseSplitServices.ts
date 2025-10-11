import { supabase } from "@/libs/supabase"

const TABLE_NAME = 'expense_splits'

export type IExpenseSplit = {
  id: string
  user_id: string
  amount: number
  expense_id: string
}

export const expenseSplitServices = {
  async add(ExpenseSplits: Omit<IExpenseSplit, 'id'>[]) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(ExpenseSplits)
      .select('*')
    if (error) throw error
    return data
  },
  async getAllOfUser(userId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(`*, expenses(*)`)
      .eq('user_id', userId)
    if (error) throw error
    return data
  },
}
